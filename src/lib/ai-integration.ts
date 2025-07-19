import { AgentPlan } from './agent-planner'
import { ParsedAPI, APIEndpoint } from './api-analyzer'

export interface AIResponse {
  content: string
  functionCalls?: FunctionCall[]
  error?: string
}

export interface FunctionCall {
  name: string
  parameters: Record<string, unknown>
  result?: unknown
  error?: string
}

export interface AgentExecution {
  id: string
  userMessage: string
  agentResponse: string
  functionCalls: FunctionCall[]
  timestamp: Date
  success: boolean
  error?: string
}

// Function registry for dynamic agent execution
const functionRegistry: Record<string, (args: Record<string, unknown>, context: Record<string, unknown>, api: ParsedAPI, credentials: Record<string, string>) => Promise<unknown>> = {
  // Example Shopify inventory function
  async getLowestStockItems(args, context, api, credentials) {
    // This function should call the Shopify inventory endpoint (replace with real logic)
    // For demo: call the first GET endpoint found
    const endpoint = api.endpoints.find(e => e.summary.toLowerCase().includes('inventory') && e.method === 'GET') || api.endpoints[0];
    if (!endpoint) throw new Error('No inventory endpoint found');
    const ai = new AIIntegration();
    const fakeCall = { name: 'getLowestStockItems', parameters: args };
    const result = await ai.executeFunctionCall(fakeCall, api, credentials);
    // Optionally process/sort/filter result here
    return result.result;
  },
  // Example email function (replace with real email integration)
  async sendEmail(args, context, api, credentials) {
    // args should include { to, subject, body }
    // For demo: just log and return
    console.log('Sending email:', args);
    return { status: 'sent', ...args };
  }
};

// Generic dynamic agent plan executor
export async function executeAgentFunctionCalls(functionCalls: FunctionCall[], api: ParsedAPI, credentials: Record<string, string>) {
  let context: Record<string, unknown> = {};
  let results: FunctionCall[] = [];
  for (const call of functionCalls) {
    if (functionRegistry[call.name]) {
      try {
        const result = await functionRegistry[call.name](call.parameters, context, api, credentials);
        results.push({ ...call, result });
        context[call.name] = result;
      } catch (error) {
        results.push({ ...call, error: error instanceof Error ? error.message : String(error) });
      }
    } else {
      results.push({ ...call, error: `Unknown function: ${call.name}` });
    }
  }
  return results;
}

export class AIIntegration {
  private apiKey: string
  private provider: 'openai' | 'claude' | 'openrouter'
  private baseUrl: string

  constructor(provider: 'openai' | 'claude' | 'openrouter' = 'openai', apiKey?: string) {
    this.provider = provider
    if (provider === 'openrouter') {
      this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || ''
      this.baseUrl = 'https://openrouter.ai/api/v1'
    } else if (provider === 'openai') {
      this.apiKey = apiKey || process.env.OPENAI_API_KEY || ''
      this.baseUrl = 'https://api.openai.com/v1'
    } else {
      this.apiKey = apiKey || ''
      this.baseUrl = 'https://api.anthropic.com/v1'
    }
  }

  async executeAgent(
    plan: AgentPlan,
    userMessage: string,
    api: ParsedAPI,
    apiCredentials: Record<string, string>
  ): Promise<AgentExecution> {
    const execution: AgentExecution = {
      id: `exec_${Date.now()}`,
      userMessage,
      agentResponse: '',
      functionCalls: [],
      timestamp: new Date(),
      success: false
    }

    try {
      const aiResponse = await this.callAI(
        plan.systemPrompt,
        userMessage,
        plan.functionDefinitions
      )

      execution.agentResponse = aiResponse.content

      if (aiResponse.functionCalls) {
        for (const functionCall of aiResponse.functionCalls) {
          const result = await this.executeFunctionCall(
            functionCall,
            api,
            apiCredentials
          )
          execution.functionCalls.push(result)
        }

        if (execution.functionCalls.length > 0) {
          const followUpResponse = await this.getFollowUpResponse(
            plan.systemPrompt,
            userMessage,
            execution.functionCalls
          )
          execution.agentResponse = followUpResponse.content
        }
      }

      execution.success = true
    } catch (error) {
      execution.error = error instanceof Error ? error.message : 'Unknown error'
      execution.agentResponse = this.generateErrorResponse(execution.error)
    }

    return execution
  }

  private async callAI(
    systemPrompt: string,
    userMessage: string,
    functions: FunctionCall[]
  ): Promise<AIResponse> {
    if (this.provider === 'openai') {
      return this.callOpenAI(systemPrompt, userMessage, functions)
    } else if (this.provider === 'openrouter') {
      return this.callOpenRouter(systemPrompt, userMessage, functions)
    } else {
      return this.callClaude(systemPrompt, userMessage, functions)
    }
  }

  private async callOpenAI(
    systemPrompt: string,
    userMessage: string,
    functions: FunctionCall[]
  ): Promise<AIResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        functions: functions.length > 0 ? functions : undefined,
        function_call: functions.length > 0 ? 'auto' : undefined,
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const message = data.choices[0].message

    const result: AIResponse = {
      content: message.content || ''
    }

    if (message.function_call) {
      result.functionCalls = [{
        name: message.function_call.name,
        parameters: JSON.parse(message.function_call.arguments || '{}')
      }]
    }

    return result
  }

  private async callOpenRouter(
    systemPrompt: string,
    userMessage: string,
    functions: FunctionCall[]
  ): Promise<AIResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-app-domain.com', // Optional: set your app domain
        'X-Title': 'LivelyAPI', // Optional: set your app name
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        functions: functions.length > 0 ? functions : undefined,
        function_call: functions.length > 0 ? 'auto' : undefined,
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    const message = data.choices[0].message

    const result: AIResponse = {
      content: message.content || ''
    }

    if (message.function_call) {
      result.functionCalls = [{
        name: message.function_call.name,
        parameters: JSON.parse(message.function_call.arguments || '{}')
      }]
    }

    return result
  }

  private async callClaude(
    systemPrompt: string,
    userMessage: string,
    functions: FunctionCall[]
  ): Promise<AIResponse> {
    // Claude implementation would go here
    // For now, return a mock response
    return {
      content: "I'm a Claude-powered agent ready to help with your API operations. However, Claude integration is not fully implemented in this demo."
    }
  }

  public async executeFunctionCall(
    functionCall: FunctionCall,
    api: ParsedAPI,
    credentials: Record<string, string>
  ): Promise<FunctionCall> {
    try {
      const endpoint = this.findEndpointForFunction(functionCall.name, api)
      if (!endpoint) {
        throw new Error(`Unknown function: ${functionCall.name}`)
      }

      const apiRequest = this.buildAPIRequest(endpoint, functionCall.parameters, api, credentials)
      
      const response = await fetch(apiRequest.url, apiRequest.options)
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      
      return {
        ...functionCall,
        result
      }
    } catch (error) {
      return {
        ...functionCall,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private findEndpointForFunction(functionName: string, api: ParsedAPI): APIEndpoint | null {
    return api.endpoints.find(endpoint => {
      const expectedName = this.generateFunctionName(endpoint)
      return expectedName === functionName
    }) || null
  }

  private generateFunctionName(endpoint: APIEndpoint): string {
    const path = endpoint.path.replace(/[{}]/g, '').replace(/\//g, '_')
    const method = endpoint.method.toLowerCase()
    return `${method}${path}`.replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_')
  }

  private buildAPIRequest(
    endpoint: APIEndpoint,
    parameters: Record<string, unknown>,
    api: ParsedAPI,
    credentials: Record<string, string>
  ): { url: string; options: RequestInit } {
    let url = api.baseUrl + endpoint.path
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (api.authentication.type === 'bearer') {
      headers['Authorization'] = `Bearer ${credentials.apiKey || credentials.token}`
    } else if (api.authentication.type === 'apiKey') {
      if (api.authentication.location === 'header') {
        headers[api.authentication.name || 'X-API-Key'] = credentials.apiKey || ''
      }
    }

    endpoint.parameters
      .filter(p => p.location === 'path')
      .forEach(param => {
        if (parameters[param.name]) {
          url = url.replace(`{${param.name}}`, String(parameters[param.name]))
        }
      })

    const queryParams = new URLSearchParams()
    endpoint.parameters
      .filter(p => p.location === 'query')
      .forEach(param => {
        if (parameters[param.name] !== undefined) {
          queryParams.append(param.name, String(parameters[param.name]))
        }
      })

    if (queryParams.toString()) {
      url += '?' + queryParams.toString()
    }

    let body: string | undefined
    const bodyParams = endpoint.parameters.filter(p => p.location === 'body')
    if (bodyParams.length > 0 && endpoint.method !== 'GET') {
      const bodyData: Record<string, unknown> = {}
      bodyParams.forEach(param => {
        if (parameters[param.name] !== undefined) {
          bodyData[param.name] = parameters[param.name]
        }
      })
      body = JSON.stringify(bodyData)
    }

    return {
      url,
      options: {
        method: endpoint.method,
        headers,
        body
      }
    }
  }

  private async getFollowUpResponse(
    systemPrompt: string,
    originalMessage: string,
    functionResults: FunctionCall[]
  ): Promise<AIResponse> {
    const resultsContext = functionResults.map(fc => 
      `Function ${fc.name} ${fc.error ? 'failed' : 'succeeded'}: ${fc.error || JSON.stringify(fc.result)}`
    ).join('\n')

    const followUpMessage = `Based on the function call results:\n${resultsContext}\n\nPlease provide a helpful response to the user's original request: "${originalMessage}"`

    return this.callAI(systemPrompt, followUpMessage, [])
  }

  private generateErrorResponse(error: string): string {
    return `I apologize, but I encountered an error while processing your request: ${error}. Please try again or rephrase your question.`
  }

  async testAgent(plan: AgentPlan, testMessage: string): Promise<{ agentResponse: string }> {
    return { agentResponse: `This is a test response to: "${testMessage}". In a real implementation, I would process this using the configured AI model and execute any necessary API calls.` }
  }
}