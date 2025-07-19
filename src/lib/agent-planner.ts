import { ParsedAPI, APIEndpoint } from './api-analyzer'

export interface AgentStep {
  id: string
  type: 'api_call' | 'condition' | 'response' | 'input'
  title: string
  description: string
  endpoint?: APIEndpoint
  parameters?: Record<string, string | number | boolean>
  condition?: string
  responseTemplate?: string
  nextSteps?: string[]
}

export interface AgentWorkflow {
  id: string
  name: string
  description: string
  goal: string
  steps: AgentStep[]
  triggers: string[]
  responses: Record<string, string>
}

export interface AgentPlan {
  workflow: AgentWorkflow
  systemPrompt: string
  functionDefinitions: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, {
        type: string
        description: string
        example?: string
      }>
      required: string[]
    }
  }[]
  conversationFlow: ConversationNode[]
}

export interface ConversationNode {
  id: string
  type: 'greeting' | 'question' | 'action' | 'response' | 'error'
  message: string
  triggers: string[]
  actions?: string[]
  nextNodes?: string[]
}

export class AgentPlanner {
  private api: ParsedAPI

  constructor(api: ParsedAPI) {
    this.api = api
  }

  async planAgent(userGoal: string): Promise<AgentPlan> {
    // Analyze the user's goal and map to API capabilities
    const workflow = this.createWorkflow(userGoal)
    const systemPrompt = this.generateSystemPrompt(workflow)
    const functionDefinitions = this.generateFunctionDefinitions()
    const conversationFlow = this.generateConversationFlow(workflow)

    return {
      workflow,
      systemPrompt,
      functionDefinitions,
      conversationFlow
    }
  }

  private findRelevantEndpoints(goal: string): APIEndpoint[] {
    const goalLower = goal.toLowerCase()
    const scoredEndpoints = this.api.endpoints.map(endpoint => {
      let score = 0
      
      // Check if goal mentions endpoint path or summary
      if (goalLower.includes(endpoint.path.toLowerCase().replace(/[{}]/g, ''))) {
        score += 10
      }
      
      if (goalLower.includes(endpoint.summary.toLowerCase())) {
        score += 8
      }
      
      // Check tags
      endpoint.tags.forEach(tag => {
        if (goalLower.includes(tag.toLowerCase())) {
          score += 6
        }
      })

      // Check common patterns
      if (this.api.name === 'Stripe') {
        if (goalLower.includes('payment') && endpoint.path.includes('payment')) score += 10
        if (goalLower.includes('customer') && endpoint.path.includes('customer')) score += 10
        if (goalLower.includes('subscription') && endpoint.path.includes('subscription')) score += 10
      }
      
      if (this.api.name === 'Shopify') {
        if (goalLower.includes('order') && endpoint.path.includes('order')) score += 10
        if (goalLower.includes('product') && endpoint.path.includes('product')) score += 10
        if (goalLower.includes('customer') && endpoint.path.includes('customer')) score += 10
      }
      
      if (this.api.name === 'Slack') {
        if (goalLower.includes('message') && endpoint.path.includes('chat')) score += 10
        if (goalLower.includes('channel') && endpoint.path.includes('channel')) score += 10
        if (goalLower.includes('user') && endpoint.path.includes('user')) score += 10
      }

      return { endpoint, score }
    })

    // Return endpoints with score > 0, sorted by relevance
    return scoredEndpoints
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5) // Limit to top 5 most relevant
      .map(item => item.endpoint)
  }

  private createWorkflow(goal: string): AgentWorkflow {
    const steps: AgentStep[] = []
    
    // Add greeting step
    steps.push({
      id: 'greeting',
      type: 'response',
      title: 'Greeting',
      description: 'Welcome the user and explain capabilities',
      responseTemplate: this.generateGreeting(goal),
      nextSteps: ['input']
    })

    // Add input collection step
    steps.push({
      id: 'input',
      type: 'input',
      title: 'Collect Information',
      description: 'Gather required information from user',
      nextSteps: ['process']
    })

    // Add processing steps for each relevant endpoint
    this.findRelevantEndpoints(goal).forEach((endpoint, index) => {
      const stepId = `api_call_${index}`
      steps.push({
        id: stepId,
        type: 'api_call',
        title: `${endpoint.summary}`,
        description: endpoint.description,
        endpoint,
        parameters: this.generateParameterMapping(endpoint),
        nextSteps: [`response_${index}`]
      })

      steps.push({
        id: `response_${index}`,
        type: 'response',
        title: `Respond with ${endpoint.summary} results`,
        description: `Format and present the results from ${endpoint.summary}`,
        responseTemplate: this.generateResponseTemplate(endpoint),
        nextSteps: []
      })
    })

    return {
      id: `workflow_${Date.now()}`,
      name: this.generateWorkflowName(goal),
      description: goal,
      goal,
      steps,
      triggers: this.generateTriggers(goal),
      responses: this.generateResponses(goal)
    }
  }

  private generateSystemPrompt(workflow: AgentWorkflow): string {
    return `You are an AI assistant specialized in ${this.api.name} operations. Your goal is to help users ${workflow.goal}.

CAPABILITIES:
${this.api.capabilities.map(cap => `- ${cap}`).join('\n')}

WORKFLOW:
${workflow.steps.map(step => `${step.id}: ${step.description}`).join('\n')}

INSTRUCTIONS:
1. Always be helpful and professional
2. Ask for clarification when needed
3. Use the provided functions to interact with the ${this.api.name} API
4. Format responses in a user-friendly way
5. Handle errors gracefully and suggest alternatives
6. Confirm actions before executing them

RESPONSE STYLE:
- Be conversational and friendly
- Explain what you're doing and why
- Provide clear next steps
- Use examples when helpful

Remember: You can only perform actions related to ${this.api.name}. If users ask about other services, politely redirect them to ${this.api.name}-related tasks.`
  }

  private generateFunctionDefinitions(): {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, {
        type: string
        description: string
        example?: string
      }>
      required: string[]
    }
  }[] {
    return this.findRelevantEndpoints('').map(endpoint => {
      const parameters: {
        type: 'object'
        properties: Record<string, {
          type: string
          description: string
          example?: string
        }>
        required: string[]
      } = {
        type: 'object',
        properties: {},
        required: []
      }

      endpoint.parameters.forEach(param => {
        parameters.properties[param.name] = {
          type: param.type,
          description: param.description
        }
        
        if (param.example) {
          parameters.properties[param.name].example = param.example.toString();
        }

        if (param.required) {
          parameters.required.push(param.name)
        }
      })

      return {
        name: this.generateFunctionName(endpoint),
        description: `${endpoint.summary}: ${endpoint.description}`,
        parameters
      }
    })
  }

  private generateConversationFlow(workflow: AgentWorkflow): ConversationNode[] {
    const nodes: ConversationNode[] = []

    // Greeting node
    nodes.push({
      id: 'greeting',
      type: 'greeting',
      message: workflow.responses.greeting || `Hello! I can help you with ${this.api.name} operations. ${workflow.goal}`,
      triggers: ['start', 'hello', 'hi'],
      nextNodes: ['question']
    })

    // Question node
    nodes.push({
      id: 'question',
      type: 'question',
      message: 'What would you like me to help you with?',
      triggers: [],
      nextNodes: ['action']
    })

    // Action nodes for each endpoint
    workflow.steps
      .filter(step => step.type === 'api_call')
      .forEach(step => {
        nodes.push({
          id: step.id,
          type: 'action',
          message: `I'll ${step.title.toLowerCase()} for you.`,
          triggers: this.generateTriggers(step.title),
          actions: [step.id],
          nextNodes: ['response']
        })
      })

    // Response node
    nodes.push({
      id: 'response',
      type: 'response',
      message: 'Here are the results:',
      triggers: [],
      nextNodes: ['question']
    })

    // Error node
    nodes.push({
      id: 'error',
      type: 'error',
      message: 'I encountered an error. Let me try to help you in a different way.',
      triggers: [],
      nextNodes: ['question']
    })

    return nodes
  }

  private generateWorkflowName(goal: string): string {
    const words = goal.split(' ').slice(0, 4)
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Agent'
  }

  private generateTriggers(text: string): string[] {
    const triggers = []
    const words = text.toLowerCase().split(' ')
    
    // Add individual words as triggers
    words.forEach(word => {
      if (word.length > 3) {
        triggers.push(word)
      }
    })

    // Add common variations
    if (text.toLowerCase().includes('payment')) {
      triggers.push('pay', 'charge', 'billing', 'invoice')
    }
    
    if (text.toLowerCase().includes('customer')) {
      triggers.push('client', 'user', 'account')
    }
    
    if (text.toLowerCase().includes('order')) {
      triggers.push('purchase', 'buy', 'transaction')
    }

    return [...new Set(triggers)]
  }

  private generateGreeting(goal: string): string {
    return `Hello! I'm your ${this.api.name} assistant. I can help you ${goal}. What would you like me to help you with today?`
  }

  private generateParameterMapping(endpoint: APIEndpoint): Record<string, string | number | boolean> {
    const mapping: Record<string, string | number | boolean> = {}
    
    endpoint.parameters.forEach(param => {
      if (param.example) {
        mapping[param.name] = param.example
      } else {
        // Generate reasonable defaults based on type
        switch (param.type) {
          case 'string':
            mapping[param.name] = `{user_input_${param.name}}`
            break
          case 'integer':
          case 'number':
            mapping[param.name] = param.name.includes('limit') ? 10 : 1
            break
          case 'boolean':
            mapping[param.name] = true
            break
          default:
            mapping[param.name] = `{${param.name}}`
        }
      }
    })

    return mapping
  }

  private generateResponseTemplate(endpoint: APIEndpoint): string {
    if (endpoint.method === 'GET') {
      return `I found the ${endpoint.summary.toLowerCase()} information. Here's what I retrieved: {response_data}`
    } else if (endpoint.method === 'POST') {
      return `Successfully created ${endpoint.summary.toLowerCase()}. Here are the details: {response_data}`
    } else if (endpoint.method === 'PUT' || endpoint.method === 'PATCH') {
      return `Successfully updated ${endpoint.summary.toLowerCase()}. Here are the updated details: {response_data}`
    } else if (endpoint.method === 'DELETE') {
      return `Successfully deleted ${endpoint.summary.toLowerCase()}.`
    }

    return `Operation completed successfully. Result: {response_data}`
  }

  private generateResponses(goal: string): Record<string, string> {
    return {
      greeting: `Hello! I'm your ${this.api.name} assistant. I can help you ${goal}.`,
      help: `I can help you with: ${this.api.capabilities.map(cap => cap.toLowerCase()).join(', ')}.`,
      error: `I encountered an error while processing your request. Please try again or rephrase your question.`,
      success: `Great! I've successfully completed your request.`,
      clarification: `I need a bit more information to help you. Could you please provide more details?`
    }
  }

  private generateFunctionName(endpoint: APIEndpoint): string {
    const path = endpoint.path.replace(/[{}]/g, '').replace(/\//g, '_')
    const method = endpoint.method.toLowerCase()
    return `${method}${path}`.replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_')
  }
}