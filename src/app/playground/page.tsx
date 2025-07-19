'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bot, 
  Send, 
  User, 
  Play, 
  RotateCcw, 
  Settings,
  MessageSquare,
  Code,
  BarChart3,
  Clock
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
}

export default function PlaygroundPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      content: 'Hi! I\'m your AI assistant. I can help you with order tracking, customer support, and general inquiries. How can I assist you today?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState('customer-support')

  const agents = [
    { id: 'customer-support', name: 'Customer Support Bot', status: 'active' },
    { id: 'sales-assistant', name: 'Sales Assistant', status: 'active' },
    { id: 'order-tracker', name: 'Order Tracker', status: 'inactive' }
  ]

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

    // Simulate API call
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: getAgentResponse(inputMessage),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, agentResponse])
      setIsLoading(false)
    }, 1500)
  }

  const getAgentResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('order') || input.includes('track')) {
      return 'I can help you track your order! Please provide your order number, and I\'ll look up the current status and tracking information for you.'
    } else if (input.includes('return') || input.includes('refund')) {
      return 'I understand you\'d like to return an item. I can help you start the return process. Could you please provide your order number and the reason for the return?'
    } else if (input.includes('support') || input.includes('help')) {
      return 'I\'m here to help! I can assist with order tracking, returns, product information, and general customer support questions. What specific issue can I help you with?'
    } else {
      return 'Thank you for your message! I\'m designed to help with customer support inquiries. Could you please provide more details about what you need assistance with?'
    }
  }

  const resetConversation = () => {
    setMessages([
      {
        id: '1',
        type: 'agent',
        content: 'Hi! I\'m your AI assistant. I can help you with order tracking, customer support, and general inquiries. How can I assist you today?',
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
            <Button variant="outline">
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
                        Testing Environment
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
          </div>

          {/* Sidebar */}
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
                {[
                  'Where is my order?',
                  'I want to return an item',
                  'How do I track my package?',
                  'Cancel my recent order',
                  'What\'s your return policy?'
                ].map((scenario, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start text-xs"
                    onClick={() => setInputMessage(scenario)}
                  >
                    "{scenario}"
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Session Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Session Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Messages</span>
                  </div>
                  <span className="font-medium">{messages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Avg Response</span>
                  </div>
                  <span className="font-medium">1.2s</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Success Rate</span>
                  </div>
                  <span className="font-medium">95%</span>
                </div>
              </CardContent>
            </Card>

            {/* Debug Info */}
            <Card>
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
      </div>
    </div>
  )
}