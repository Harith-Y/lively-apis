'use client'

import { demoAgents } from '@/lib/demo-data'
const agents = demoAgents
const defaultAgentId = agents[0]?.id || 'customer-support'

import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { APIAnalyzer } from '@/lib/api-analyzer'
import { AgentPlanner, AgentPlan } from '@/lib/agent-planner'

import { 
  Bot, 
  Send, 
  User, 
  RotateCcw, 
  Settings,
  MessageSquare,
  BarChart3,
  Clock,
  Sparkles
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
}

interface ApiCredentials {
  apiKey: string
}

export default function PlaygroundPage() {
  // Store chat history per agent
  const [chats, setChats] = useState<{ [agentId: string]: Message[] }>({
    [defaultAgentId]: [
      {
        id: '1',
        type: 'agent',
        content: `Hi! I'm ${agents[0]?.name || 'your AI assistant'}. ${agents[0]?.description || 'How can I assist you today?'}`,
        timestamp: new Date()
      }
    ]
  })
  const [selectedAgent, setSelectedAgent] = useState(defaultAgentId)
  const [messages, setMessages] = useState<Message[]>(chats[defaultAgentId])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [agentPlan, setAgentPlan] = useState<AgentPlan | null>(null)
  const [apiCredentials, setApiCredentials] = useState<ApiCredentials>({ apiKey: '' })

  // Playground settings state
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1000)

  // When agent changes, load or initialize chat for that agent
  useEffect(() => {
    if (!chats[selectedAgent]) {
      const agent = agents.find(a => a.id === selectedAgent)
      const initialMessage: Message[] = [{
        id: '1',
        type: 'agent',
        content: `Hi! I'm ${agent?.name || 'your AI assistant'}. ${agent?.description || 'How can I assist you today?'}`,
        timestamp: new Date()
      }]
      setChats(prev => ({
        ...prev,
        [selectedAgent]: initialMessage
      }))
      setMessages(initialMessage)
    } else {
      setMessages(chats[selectedAgent])
    }
  }, [selectedAgent])

  // When messages change, update chat history for the current agent
  useEffect(() => {
    setChats(prev => ({ ...prev, [selectedAgent]: messages }))
  }, [messages, selectedAgent])

  const initializeDemoAgent = useCallback(async () => {
    try {
      const apiAnalyzer = new APIAnalyzer()
      let apiInput = ''
      let goal = ''
      
      switch (selectedAgent) {
        case 'payment-processor':
          apiInput = 'stripe'
          goal = 'Help users with payment processing, customer management, and subscription handling'
          break
        case 'ecommerce-assistant':
          apiInput = 'shopify'
          goal = 'Assist with product management, order tracking, and inventory updates'
          break
        case 'team-communicator':
          apiInput = 'slack'
          goal = 'Help with team communication, sending messages, and file management'
          break
        default:
          return
      }
      
      const parsedAPI = await apiAnalyzer.analyzeAPI(apiInput)
      const planner = new AgentPlanner(parsedAPI)
      const plan: AgentPlan = await planner.planAgent(goal)
      setAgentPlan(plan)
    } catch (error) {
      console.error('Failed to initialize demo agent:', error)
    }
  }, [selectedAgent])

  useEffect(() => {
    initializeDemoAgent()
  }, [initializeDemoAgent])

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      if (agentPlan) {
        // Use backend API for real agent response
        const res = await fetch(`${BACKEND_URL}/playground/agent-response`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentId: selectedAgent,
            agentPlan,
            message: inputMessage,
            temperature,
            maxTokens
          })
        })
        const data = await res.json()
        const agentResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'agent',
          content: data.agentResponse || 'Sorry, I could not process your request.',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, agentResponse])
      } else {
        // Fallback to mock response
        const agentResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'agent',
          content: getDemoResponse(inputMessage),
          timestamp: new Date()
        }
        setMessages(prev => [...prev, agentResponse])
      }
    } catch (error) {
      console.error('Failed to get agent response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDemoResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    const currentAgent = agents.find(a => a.id === selectedAgent)
    const agentName = currentAgent?.name || 'your AI assistant'
    const capabilities = currentAgent?.capabilities?.slice(0, 2).join(' and ').toLowerCase() || 'various tasks'
    if (currentAgent) {
      // Check for specific response patterns in demo data
      if (input.includes('order') || input.includes('track')) {
        return currentAgent.responses.order_status || currentAgent.responses.delivery_inquiry || 'I can help you track your order! Please provide your order number.'
      } else if (input.includes('payment') || input.includes('charge')) {
        return currentAgent.responses.process_payment || 'I can help you process payments securely.'
      } else if (input.includes('message') || input.includes('send')) {
        return currentAgent.responses.send_message || 'I can help you send messages to your team.'
      } else if (input.includes('product') || input.includes('item')) {
        return currentAgent.responses.product_availability || 'I can help you find product information.'
      } else if (input.includes('return') || input.includes('refund')) {
        return currentAgent.responses.return_request || currentAgent.responses.process_refund || 'I can help you with returns and refunds.'
      }
    }
    return `Thank you for your message! I'm ${agentName}. I can help with ${capabilities}. What specific task can I help you with?`
  }

  const resetConversation = () => {
    setMessages([
      {
        id: '1',
        type: 'agent',
        content: `Hi! I'm ${agents.find(a => a.id === selectedAgent)?.name || 'your AI assistant'}. ${agents.find(a => a.id === selectedAgent)?.description || 'How can I assist you today?'}`,
        timestamp: new Date()
      }
    ])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Testing Playground</h1>
            <p className="text-gray-600">Test and refine your AI agents in real-time</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={resetConversation}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={() => setSettingsOpen(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {agents.find(a => a.id === selectedAgent)?.name}
                      </CardTitle>
                      <CardDescription>
                        {agents.find(a => a.id === selectedAgent)?.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {message.type === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                        <span className="text-xs opacity-75">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    autoComplete="off"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
            {/* New row for performance/config/debug cards */}
            <div className="mt-8 flex flex-col md:flex-row gap-4">
              {/* Agent Performance */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Agent Performance</CardTitle>
                  <CardDescription>
                    Real-time metrics for selected agent
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(() => {
                    const currentAgent = agents.find(a => a.id === selectedAgent)
                    if (!currentAgent) return null
                    
                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Interactions</span>
                          </div>
                          <span className="font-medium">{currentAgent.metrics.interactions.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Avg Response</span>
                          </div>
                          <span className="font-medium">{currentAgent.metrics.avgResponseTime}s</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Success Rate</span>
                          </div>
                          <span className="font-medium">{currentAgent.metrics.successRate}%</span>
                        </div>
                      </>
                    )
                  })()}
                </CardContent>
              </Card>
              {/* API Configuration */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>API Configuration</CardTitle>
                  <CardDescription>
                    Configure API credentials for testing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter API key for testing"
                      value={apiCredentials.apiKey}
                      onChange={(e) => setApiCredentials({ ...apiCredentials, apiKey: e.target.value })}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Demo mode: Real API calls are simulated for testing
                  </div>
                </CardContent>
              </Card>
              {/* Debug Information */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Debug Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="logs" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="logs">Logs</TabsTrigger>
                      <TabsTrigger value="api">API</TabsTrigger>
                    </TabsList>
                    <TabsContent value="logs" className="space-y-2">
                      <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                        <div className="text-green-600">✓ Agent initialized</div>
                        <div className="text-blue-600">→ User message received</div>
                        <div className="text-purple-600">⚡ Processing intent</div>
                        <div className="text-green-600">✓ Response generated</div>
                      </div>
                    </TabsContent>
                    <TabsContent value="api" className="space-y-2">
                      <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                        <div>Status: <span className="text-green-600">200 OK</span></div>
                        <div>Latency: <span className="text-blue-600">1.2s</span></div>
                        <div>Tokens: <span className="text-purple-600">45</span></div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar: only keep agent selection and test scenarios */}
          <div className="space-y-6">
            {/* Agent Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Agent</CardTitle>
                <CardDescription>
                  Choose which agent to test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedAgent === agent.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{agent.name}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        agent.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{agent.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Test Scenarios */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Test Scenarios</CardTitle>
                <CardDescription>
                  Try these common user queries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {getTestScenarios().map((scenario, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start text-xs whitespace-normal break-words truncate max-w-full px-3 py-2"
                    onClick={() => setInputMessage(scenario)}
                  >
                    {scenario}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Playground Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={temperature}
                onChange={e => setTemperature(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">Controls randomness. Lower = more deterministic, higher = more creative. Current: {temperature}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
              <input
                type="number"
                min={100}
                max={4000}
                value={maxTokens}
                onChange={e => setMaxTokens(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <div className="text-xs text-gray-500 mt-1">Limits the length of the AI response. Current: {maxTokens}</div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setSettingsOpen(false)} className="w-full mt-4">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  function getTestScenarios() {
    const currentAgent = agents.find(a => a.id === selectedAgent)
    if (currentAgent) {
      return currentAgent.sampleQueries
    }
    
    switch (selectedAgent) {
      case 'payment-processor':
        return [
          'Create a new customer',
          'Process a $50 payment',
          'List all customers',
          'Create a subscription',
          'Get payment status'
        ]
      case 'ecommerce-assistant':
        return [
          'Show me all products',
          'Check recent orders',
          'Update inventory levels',
          'Find customer information',
          'Get order status'
        ]
      case 'team-communicator':
        return [
          'Send a message to #general',
          'List all team members',
          'Show available channels',
          'Upload a file',
          'Create a new channel'
        ]
      default:
        return [
          'Hello, how can you help?',
          'What can you do?',
          'Show me your capabilities',
          'Help me get started',
          'What APIs do you support?'
        ]
    }
  }
}