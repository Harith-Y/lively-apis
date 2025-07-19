'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WorkflowBuilder } from '@/components/workflow-builder'
import { APIAnalyzer, ParsedAPI } from '@/lib/api-analyzer'
import { AgentPlanner, AgentPlan } from '@/lib/agent-planner'
import { AIIntegration } from '@/lib/ai-integration'
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
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function BuilderPage() {
  const [agentName, setAgentName] = useState('')
  const [agentDescription, setAgentDescription] = useState('')
  const [apiEndpoint, setApiEndpoint] = useState('')
  const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState('')
  const [parsedAPI, setParsedAPI] = useState<ParsedAPI | null>(null)
  const [agentPlan, setAgentPlan] = useState<AgentPlan | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedAPI, setSelectedAPI] = useState<string>('')

  // Endpoint configuration modal state
  const [endpointModalOpen, setEndpointModalOpen] = useState(false)
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState<number | null>(null)
  const [endpointDraft, setEndpointDraft] = useState<unknown>(null)

  // Deploy modal state
  const [deployModalOpen, setDeployModalOpen] = useState(false)
  const [deployLoading, setDeployLoading] = useState(false)
  const [deployError, setDeployError] = useState<string | null>(null)
  const [deploySuccess, setDeploySuccess] = useState(false)
  const [deployedAgentId, setDeployedAgentId] = useState<string | null>(null)

  const apiAnalyzer = new APIAnalyzer()
  const aiIntegration = new AIIntegration()

  const popularAPIs = [
    { id: 'stripe', name: 'Stripe', description: 'Payment processing', url: 'https://api.stripe.com/v1' },
    { id: 'shopify', name: 'Shopify', description: 'E-commerce platform', url: 'https://{shop}.myshopify.com/admin/api/2023-10' },
    { id: 'slack', name: 'Slack', description: 'Team communication', url: 'https://slack.com/api' }
  ]

  const handleAnalyzeAPI = async () => {
    if (!apiEndpoint && !selectedAPI) return
    
    setIsAnalyzing(true)
    try {
      const input = selectedAPI || apiEndpoint
      const analyzed = await apiAnalyzer.analyzeAPI(input)
      setParsedAPI(analyzed)
    } catch (error) {
      console.error('Failed to analyze API:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateAgent = async () => {
    if (!parsedAPI || !naturalLanguagePrompt) return
    
    setIsGenerating(true)
    try {
      const planner = new AgentPlanner(parsedAPI)
      const plan = await planner.planAgent(naturalLanguagePrompt)
      setAgentPlan(plan)
    } catch (error) {
      console.error('Failed to generate agent:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTestAgent = async () => {
    if (!agentPlan) return
    
    try {
      const execution = await aiIntegration.testAgent(agentPlan, "Hello, can you help me?")
      console.log('Test execution:', execution)
      // You could show this in a modal or redirect to playground
    } catch (error) {
      console.error('Failed to test agent:', error)
    }
  }

  const handleDeployAgent = async () => {
    if (!agentPlan || !parsedAPI) return;
    setDeployLoading(true);
    setDeployError(null);
    setDeploySuccess(false);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('sb-access-token') : null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          name: agentName || 'Untitled Agent',
          description: agentDescription || '',
          api_endpoint: apiEndpoint || parsedAPI.baseUrl,
          configuration: agentPlan,
        })
      });
      if (!res.ok) throw new Error('Failed to deploy agent');
      const data = await res.json();
      setDeployedAgentId(data.id || null);
      setDeploySuccess(true);
    } catch (err: unknown) {
      let message = 'Failed to deploy agent';
      if (err && typeof err === 'object' && 'message' in err && typeof (err as unknown as { message: string }).message === 'string') {
        message = (err as unknown as { message: string }).message;
      }
      setDeployError(message);
    } finally {
      setDeployLoading(false);
    }
  };

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
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={handleTestAgent}
              disabled={!agentPlan}
            >
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
                      Describe your agent&apos;s behavior in plain English
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Describe what you want your agent to do. For example: &apos;When a user asks about their order status, look up their order using the order ID and return the current status, tracking number, and estimated delivery date...&apos;"
                      value={naturalLanguagePrompt}
                      onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
                      rows={6}
                      className="mb-4"
                    />
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={handleGenerateAgent}
                      disabled={!parsedAPI || !naturalLanguagePrompt || isGenerating}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate Agent Workflow'}
                    </Button>
                    
                    {agentPlan && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">Agent Generated Successfully!</span>
                        </div>
                        <p className="text-green-700 text-sm mt-1">
                          Your agent workflow has been created with {agentPlan.workflow.steps.length} steps.
                        </p>
                      </div>
                    )}
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
                        Popular APIs
                      </label>
                      <div className="grid grid-cols-1 gap-2 mb-4">
                        {popularAPIs.map((api) => (
                          <Button
                            key={api.id}
                            variant={selectedAPI === api.id ? "default" : "outline"}
                            className="justify-start h-auto p-3"
                            onClick={() => {
                              setSelectedAPI(api.id)
                              setApiEndpoint(api.url)
                            }}
                          >
                            <div className="text-left">
                              <div className="font-medium">{api.name}</div>
                              <div className="text-xs opacity-75">{api.description}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                    
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
                    
                    <Button 
                      onClick={handleAnalyzeAPI}
                      disabled={(!apiEndpoint && !selectedAPI) || isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? 'Analyzing...' : 'Analyze API'}
                    </Button>
                    
                    {parsedAPI && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="text-blue-800 font-medium">{parsedAPI.name} Analyzed</span>
                        </div>
                        <p className="text-blue-700 text-sm mb-2">{parsedAPI.description}</p>
                        <div className="text-xs text-blue-600">
                          Found {parsedAPI.endpoints.length} endpoints, {parsedAPI.capabilities.length} capabilities
                        </div>
                      </div>
                    )}
                    
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
                    <CardTitle>
                      Available Endpoints
                      {parsedAPI && (
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({parsedAPI.endpoints.length} found)
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {parsedAPI ? 'Detected API endpoints from your configuration' : 'Analyze an API to see available endpoints'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {parsedAPI ? parsedAPI.endpoints.slice(0, 5).map((endpoint, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {endpoint.method}
                            </span>
                            <code className="text-sm text-gray-700">{endpoint.path}</code>
                            <span className="text-sm text-gray-500">{endpoint.summary}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedEndpointIndex(index)
                              setEndpointDraft({ ...endpoint })
                              setEndpointModalOpen(true)
                            }}
                          >
                            Configure
                          </Button>
                        </div>
                      )) : (
                        <div className="text-center py-8 text-gray-500">
                          <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No API analyzed yet</p>
                          <p className="text-sm">Select a popular API or enter a custom endpoint to get started</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Behavior Tab */}
              <TabsContent value="behavior" className="space-y-6">
                {agentPlan ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Generated Workflow</CardTitle>
                      <CardDescription>
                        Visual workflow builder for your AI agent
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <WorkflowBuilder 
                        workflow={agentPlan.workflow}
                        onWorkflowChange={(workflow) => {
                          setAgentPlan({ ...agentPlan, workflow })
                        }}
                        onTest={handleTestAgent}
                      />
                    </CardContent>
                  </Card>
                ) : (
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
                )}

                {!agentPlan && (
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
                                &quot;{example}&quot;
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
                )}
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
                          <span className="text-green-800 font-medium">
                            {agentPlan ? 'Agent Ready for Deployment' : 'Configuration Complete'}
                          </span>
                        </div>
                        <p className="text-green-700 text-sm mt-1">
                          {agentPlan 
                            ? 'Your AI agent has been generated and is ready for deployment'
                            : 'All required settings have been configured'
                          }
                        </p>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        onClick={() => setDeployModalOpen(true)}
                        disabled={!agentPlan}
                      >
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
                      Hi! I&apos;m your AI assistant. How can I help you today?
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
                {agentPlan && (
                  <Button variant="outline" className="w-full justify-start" onClick={handleTestAgent}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Quick Test Agent
                  </Button>
                )}
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
      <Dialog open={endpointModalOpen} onOpenChange={setEndpointModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Endpoint</DialogTitle>
          </DialogHeader>
          {typeof endpointDraft === 'object' && endpointDraft !== null && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Path</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={(endpointDraft as { path: string }).path}
                  onChange={e => setEndpointDraft({ ...endpointDraft, path: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={(endpointDraft as { method: string }).method}
                  onChange={e => setEndpointDraft({ ...endpointDraft, method: e.target.value })}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={(endpointDraft as { summary: string }).summary || ''}
                  onChange={e => setEndpointDraft({ ...endpointDraft, summary: e.target.value })}
                />
              </div>
              {/* You can add more fields for parameters, etc. here */}
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => {
                if (selectedEndpointIndex !== null && parsedAPI) {
                  const updatedEndpoints = [...parsedAPI.endpoints];
                  if (typeof endpointDraft === 'object' && endpointDraft !== null) {
                    updatedEndpoints[selectedEndpointIndex] = { ...endpointDraft } as ParsedAPI['endpoints'][number];
                    setParsedAPI({ ...parsedAPI, endpoints: updatedEndpoints });
                  }
                }
                setEndpointModalOpen(false)
              }}
              className="w-full mt-4"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={deployModalOpen} onOpenChange={setDeployModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deploy Agent</DialogTitle>
          </DialogHeader>
          {deploySuccess ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Agent Deployed Successfully!</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Your agent is now live and ready to use.<br />
                  <span className="font-mono">ID: {deployedAgentId}</span>
                </p>
                <div className="mt-2">
                  <span className="text-xs text-gray-500">Deployment URL:</span><br />
                  <span className="text-xs font-mono text-blue-700">https://agents.livelyapi.com/agent/{deployedAgentId || '...'}</span>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setDeployModalOpen(false)} className="w-full mt-4">Close</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4">
              <p>Are you sure you want to deploy this agent? This will make it live and accessible via API and chat interfaces.</p>
              {deployError && <div className="text-red-600 text-sm">{deployError}</div>}
              <DialogFooter>
                <Button
                  onClick={handleDeployAgent}
                  className="w-full mt-4"
                  disabled={deployLoading}
                >
                  {deployLoading ? 'Deploying...' : 'Confirm & Deploy'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeployModalOpen(false)}
                  className="w-full mt-2"
                  disabled={deployLoading}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}