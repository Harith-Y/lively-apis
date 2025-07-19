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
  async getLowestStockItems(
    args: { limit?: number },
    context: Record<string, unknown>,
    api: ParsedAPI,
    credentials: Record<string, string>
  ) {
    // Step 1: Fetch products
    const productsEndpoint = api.endpoints.find((e: APIEndpoint) => e.path === '/products.json' && e.method === 'GET');
    if (!productsEndpoint) throw new Error('No products endpoint found');
    const ai = new AIIntegration();
    const productsCall = { name: 'getLowestStockItems_products', parameters: { limit: args.limit || 50 } };
    // Use the existing request builder
    const productsRequest = ai.buildAPIRequest(productsEndpoint, productsCall.parameters, api, credentials);
    const productsResp = await fetch(productsRequest.url, productsRequest.options);
    if (!productsResp.ok) throw new Error('Failed to fetch products');
    const productsData: { products?: { title: string; id: string; variants?: { inventory_item_id: string }[] }[] } = await productsResp.json();
    const products = productsData.products || [];

    // Step 2: Gather inventory item IDs
    const inventoryItemIds = products.flatMap((p: { variants?: { inventory_item_id: string }[] }) => (p.variants?.map?.((v: { inventory_item_id: string }) => v.inventory_item_id) ?? [])).filter(Boolean);
    if (!inventoryItemIds.length) return [];

    // Step 3: Fetch inventory levels
    const inventoryEndpoint = api.endpoints.find((e: APIEndpoint) => e.path === '/inventory_levels.json' && e.method === 'GET');
    if (!inventoryEndpoint) throw new Error('No inventory endpoint found');
    const inventoryParams = { inventory_item_ids: inventoryItemIds.slice(0, 50).join(',') };
    const inventoryRequest = ai.buildAPIRequest(inventoryEndpoint, inventoryParams, api, credentials);
    const inventoryResp = await fetch(inventoryRequest.url, inventoryRequest.options);
    if (!inventoryResp.ok) throw new Error('Failed to fetch inventory levels');
    const inventoryData: { inventory_levels?: { inventory_item_id: string; available: number }[] } = await inventoryResp.json();
    const inventoryLevels = inventoryData.inventory_levels || [];

    // Step 4: Map inventory levels to products
    const inventoryMap: Record<string, number> = Object.fromEntries(inventoryLevels.map((l: { inventory_item_id: string; available: number }) => [l.inventory_item_id, l.available]));
    const productsWithStock = products.map((p: { title: string; id: string; variants?: { inventory_item_id: string }[] }) => {
      const totalStock = p.variants?.reduce?.((sum: number, v: { inventory_item_id: string }) => sum + (inventoryMap[v.inventory_item_id] || 0), 0) || 0;
      return { title: p.title, id: p.id, totalStock };
    });
    // Step 5: Sort and return lowest stock items
    productsWithStock.sort((a, b) => a.totalStock - b.totalStock);
    return productsWithStock.slice(0, args.limit || 3);
  },
  // Example email function (replace with real email integration)
  async sendEmail(args, context, api, credentials) {
    // args should include { to, subject, body }
    // For demo: just log and return
    // Optionally log for debugging: Sending email
    return { status: 'sent', ...args };
  }
};

// Generic dynamic agent plan executor
export async function executeAgentFunctionCalls(functionCalls: FunctionCall[], api: ParsedAPI, credentials: Record<string, string>) {
  const context: Record<string, unknown> = {};
  const results: FunctionCall[] = [];
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

  public buildAPIRequest(
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