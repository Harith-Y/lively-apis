// AIIntegration and related logic (converted from TypeScript to JS)

class AIIntegration {
  constructor(provider = 'openai', apiKey) {
    this.provider = provider;
    if (provider === 'openrouter') {
      this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
      this.baseUrl = 'https://openrouter.ai/api/v1';
    } else if (provider === 'openai') {
      this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
      this.baseUrl = 'https://api.openai.com/v1';
    } else {
      this.apiKey = apiKey || '';
      this.baseUrl = 'https://api.anthropic.com/v1';
    }
  }

  async executeAgent(plan, userMessage, api, apiCredentials) {
    const execution = {
      id: `exec_${Date.now()}`,
      userMessage,
      agentResponse: '',
      functionCalls: [],
      timestamp: new Date(),
      success: false
    };
    try {
      const aiResponse = await this.callAI(
        plan.systemPrompt,
        userMessage,
        plan.functionDefinitions || []
      );
      execution.agentResponse = aiResponse.content;
      if (aiResponse.functionCalls) {
        for (const functionCall of aiResponse.functionCalls) {
          const result = await this.executeFunctionCall(
            functionCall,
            api,
            apiCredentials
          );
          execution.functionCalls.push(result);
        }
        if (execution.functionCalls.length > 0) {
          const followUpResponse = await this.getFollowUpResponse(
            plan.systemPrompt,
            userMessage,
            execution.functionCalls
          );
          execution.agentResponse = followUpResponse.content;
        }
      }
      execution.success = true;
    } catch (error) {
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.agentResponse = this.generateErrorResponse(execution.error);
    }
    return execution;
  }

  async callAI(systemPrompt, userMessage, functions) {
    if (this.provider === 'openai') {
      return this.callOpenAI(systemPrompt, userMessage, functions);
    } else if (this.provider === 'openrouter') {
      return this.callOpenRouter(systemPrompt, userMessage, functions);
    } else {
      return this.callClaude(systemPrompt, userMessage, functions);
    }
  }

  async callOpenAI(systemPrompt, userMessage, functions) {
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
    });
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }
    const data = await response.json();
    const message = data.choices[0].message;
    const result = {
      content: message.content || ''
    };
    if (message.function_call) {
      result.functionCalls = [{
        name: message.function_call.name,
        parameters: JSON.parse(message.function_call.arguments || '{}')
      }];
    }
    return result;
  }

  async callOpenRouter(systemPrompt, userMessage, functions) {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-app-domain.com',
        'X-Title': 'LivelyAPI',
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
    });
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }
    const data = await response.json();
    const message = data.choices[0].message;
    const result = {
      content: message.content || ''
    };
    if (message.function_call) {
      result.functionCalls = [{
        name: message.function_call.name,
        parameters: JSON.parse(message.function_call.arguments || '{}')
      }];
    }
    return result;
  }

  async callClaude(systemPrompt, userMessage, functions) {
    // Claude implementation would go here
    // For now, return a mock response
    return {
      content: "I'm a Claude-powered agent ready to help with your API operations. However, Claude integration is not fully implemented in this demo."
    };
  }

  async executeFunctionCall(functionCall, api, credentials) {
    try {
      const endpoint = this.findEndpointForFunction(functionCall.name, api);
      if (!endpoint) {
        throw new Error(`Unknown function: ${functionCall.name}`);
      }
      const apiRequest = this.buildAPIRequest(endpoint, functionCall.parameters, api, credentials);
      const response = await fetch(apiRequest.url, apiRequest.options);
      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      return {
        ...functionCall,
        result
      };
    } catch (error) {
      return {
        ...functionCall,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  findEndpointForFunction(functionName, api) {
    return api.endpoints.find(endpoint => {
      const expectedName = this.generateFunctionName(endpoint);
      return expectedName === functionName;
    }) || null;
  }

  generateFunctionName(endpoint) {
    const path = endpoint.path.replace(/[{}]/g, '').replace(/\//g, '_');
    const method = endpoint.method.toLowerCase();
    return `${method}${path}`.replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_');
  }

  buildAPIRequest(endpoint, parameters, api, credentials) {
    let url = api.baseUrl + endpoint.path;
    const headers = {
      'Content-Type': 'application/json'
    };
    if (api.authentication.type === 'bearer') {
      headers['Authorization'] = `Bearer ${credentials.apiKey || credentials.token}`;
    } else if (api.authentication.type === 'apiKey') {
      if (api.authentication.location === 'header') {
        headers[api.authentication.name || 'X-API-Key'] = credentials.apiKey || '';
      }
    }
    endpoint.parameters
      .filter(p => p.location === 'path')
      .forEach(param => {
        if (parameters[param.name]) {
          url = url.replace(`{${param.name}}`, String(parameters[param.name]));
        }
      });
    const queryParams = new URLSearchParams();
    endpoint.parameters
      .filter(p => p.location === 'query')
      .forEach(param => {
        if (parameters[param.name] !== undefined) {
          queryParams.append(param.name, String(parameters[param.name]));
        }
      });
    if (queryParams.toString()) {
      url += '?' + queryParams.toString();
    }
    let body;
    const bodyParams = endpoint.parameters.filter(p => p.location === 'body');
    if (bodyParams.length > 0 && endpoint.method !== 'GET') {
      const bodyData = {};
      bodyParams.forEach(param => {
        if (parameters[param.name] !== undefined) {
          bodyData[param.name] = parameters[param.name];
        }
      });
      body = JSON.stringify(bodyData);
    }
    return {
      url,
      options: {
        method: endpoint.method,
        headers,
        body
      }
    };
  }

  async getFollowUpResponse(systemPrompt, originalMessage, functionResults) {
    const resultsContext = functionResults.map(fc =>
      `Function ${fc.name} ${fc.error ? 'failed' : 'succeeded'}: ${fc.error || JSON.stringify(fc.result)}`
    ).join('\n');
    const followUpMessage = `Based on the function call results:\n${resultsContext}\n\nPlease provide a helpful response to the user's original request: "${originalMessage}"`;
    return this.callAI(systemPrompt, followUpMessage, []);
  }

  generateErrorResponse(error) {
    return `I apologize, but I encountered an error while processing your request: ${error}. Please try again or rephrase your question.`;
  }
}

module.exports = { AIIntegration }; 