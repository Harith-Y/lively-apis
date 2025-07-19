'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bot, 
  Code, 
  MessageSquare, 
  Settings, 
  Play, 
  Save,
  Upload,
  Link as LinkIcon,
  Sparkles,
  ArrowRight
} from 'lucide-react'

export default function BuilderPage() {
  const [agentName, setAgentName] = useState('')
  const [agentDescription, setAgentDescription] = useState('')
  const [apiEndpoint, setApiEndpoint] = useState('')
  const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Agent Builder</h1>
            <p className="text-gray-600">Create intelligent AI agents from your APIs</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Test Agent
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Builder */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="setup" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="setup">Setup</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="behavior">Behavior</TabsTrigger>
                <TabsTrigger value="deploy">Deploy</TabsTrigger>
              </TabsList>

              {/* Setup Tab */}
              <TabsContent value="setup" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="w-5 h-5 mr-2" />
                      Agent Information
                    </CardTitle>
                    <CardDescription>
                      Basic information about your AI agent
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Agent Name
                      </label>
                      <Input
                        placeholder="e.g., Customer Support Assistant"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <Textarea
                        placeholder="Describe what your agent does and how it helps users..."
                        value={agentDescription}
                        onChange={(e) => setAgentDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Natural Language Builder
                    </CardTitle>
                    <CardDescription>
                      Describe your agent's behavior in plain English
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Describe what you want your agent to do. For example: 'When a user asks about their order status, look up their order using the order ID and return the current status, tracking number, and estimated delivery date...'"
                      value={naturalLanguagePrompt}
                      onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
                      rows={6}
                      className="mb-4"
                    />
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Agent Workflow
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* API Tab */}
              <TabsContent value="api" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="w-5 h-5 mr-2" />
                      API Configuration
                    </CardTitle>
                    <CardDescription>
                      Connect your API endpoints
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Endpoint URL
                      </label>
                      <Input
                        placeholder="https://api.example.com/v1"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 flex-col">
                        <Upload className="w-6 h-6 mb-2" />
                        Upload OpenAPI Spec
                      </Button>
                      <Button variant="outline" className="h-20 flex-col">
                        <LinkIcon className="w-6 h-6 mb-2" />
                        Import from URL
                      </Button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Authentication
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>No Authentication</option>
                        <option>API Key</option>
                        <option>Bearer Token</option>
                        <option>OAuth 2.0</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Available Endpoints</CardTitle>
                    <CardDescription>
                      Detected API endpoints from your configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { method: 'GET', path: '/orders/{id}', description: 'Get order details' },
                        { method: 'POST', path: '/orders', description: 'Create new order' },
                        { method: 'GET', path: '/customers/{id}', description: 'Get customer info' }
                      ].map((endpoint, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {endpoint.method}
                            </span>
                            <code className="text-sm text-gray-700">{endpoint.path}</code>
                            <span className="text-sm text-gray-500">{endpoint.description}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Configure
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Behavior Tab */}
              <TabsContent value="behavior" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Conversation Flow
                    </CardTitle>
                    <CardDescription>
                      Define how your agent responds to users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Welcome Message
                        </label>
                        <Textarea
                          placeholder="Hi! I'm your AI assistant. How can I help you today?"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fallback Response
                        </label>
                        <Textarea
                          placeholder="I'm sorry, I didn't understand that. Could you please rephrase your question?"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Personality & Tone
                        </label>
                        <select className="w-full p-2 border border-gray-300 rounded-md">
                          <option>Professional</option>
                          <option>Friendly</option>
                          <option>Casual</option>
                          <option>Formal</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Intent Recognition</CardTitle>
                    <CardDescription>
                      Train your agent to understand user intents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { intent: 'Check Order Status', examples: ['Where is my order?', 'Order status', 'Track my package'] },
                        { intent: 'Cancel Order', examples: ['Cancel my order', 'I want to cancel', 'Stop my order'] },
                        { intent: 'Return Item', examples: ['Return this item', 'I want a refund', 'How to return?'] }
                      ].map((intent, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{intent.intent}</h4>
                            <Button variant="ghost" size="sm">Edit</Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {intent.examples.map((example, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                                "{example}"
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        Add New Intent
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Deploy Tab */}
              <TabsContent value="deploy" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Deployment Settings
                    </CardTitle>
                    <CardDescription>
                      Configure how your agent will be deployed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deployment Environment
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>Production</option>
                        <option>Staging</option>
                        <option>Development</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate Limiting
                      </label>
                      <Input placeholder="100 requests per minute" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="analytics" className="rounded" />
                      <label htmlFor="analytics" className="text-sm text-gray-700">
                        Enable analytics and monitoring
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ready to Deploy</CardTitle>
                    <CardDescription>
                      Your agent is configured and ready for deployment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-green-800 font-medium">Configuration Complete</span>
                        </div>
                        <p className="text-green-700 text-sm mt-1">
                          All required settings have been configured
                        </p>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Deploy Agent
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Preview</CardTitle>
                <CardDescription>
                  See how your agent will appear to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {agentName || 'Your Agent'}
                      </div>
                      <div className="text-sm text-gray-500">AI Assistant</div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-700">
                      Hi! I'm your AI assistant. How can I help you today?
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Play className="w-4 h-4 mr-2" />
                  Test in Playground
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Save className="w-4 h-4 mr-2" />
                  Save as Template
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Code className="w-4 h-4 mr-2" />
                  View Generated Code
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Help & Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="#" className="block text-sm text-purple-600 hover:text-purple-700">
                  📚 Builder Documentation
                </a>
                <a href="#" className="block text-sm text-purple-600 hover:text-purple-700">
                  🎥 Video Tutorials
                </a>
                <a href="#" className="block text-sm text-purple-600 hover:text-purple-700">
                  💬 Community Support
                </a>
                <a href="#" className="block text-sm text-purple-600 hover:text-purple-700">
                  🔧 API Reference
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}