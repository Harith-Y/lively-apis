'use client'

import { useState, useEffect } from 'react'
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
import { useRouter, useSearchParams } from 'next/navigation'
import toast from "react-hot-toast"; // Ensure this is at the top if not already

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

  // Code Generation modal state
  const [codeModalOpen, setCodeModalOpen] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [codeLoading, setCodeLoading] = useState(false)
  const [codeError, setCodeError] = useState<string | null>(null)

  // Agent Composition modal state
  const [composeModalOpen, setComposeModalOpen] = useState(false)
  const [templates, setTemplates] = useState<Array<{ id: string; name: string; [key: string]: unknown }>>([])
  const [templatesLoading, setTemplatesLoading] = useState(false)
  const [templatesError, setTemplatesError] = useState<string | null>(null)
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([])

  // Automated API Discovery state
  const [apiSuggestions, setApiSuggestions] = useState<Array<{ id: string; name: string; [key: string]: unknown }>>([])
  const [apiSuggestLoading, setApiSuggestLoading] = useState(false)
  const [apiSuggestError, setApiSuggestError] = useState<string | null>(null)

  // Template Library modal state
  const [templateLibraryOpen, setTemplateLibraryOpen] = useState(false)
  const [libraryTemplates, setLibraryTemplates] = useState<Array<{ id: string; name: string; [key: string]: unknown }>>([])
  const [libraryLoading, setLibraryLoading] = useState(false)
  const [libraryError, setLibraryError] = useState<string | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<{ id: string; name: string; [key: string]: unknown } | null>(null)

  // MCP Server Management state
  const [mcpServers, setMcpServers] = useState<Array<{ id: string; name: string; url: string; [key: string]: unknown }>>([])
  const [mcpLoading, setMcpLoading] = useState(false)
  const [mcpError, setMcpError] = useState<string | null>(null)
  const [newMcpName, setNewMcpName] = useState('')
  const [newMcpUrl, setNewMcpUrl] = useState('')
  const [selectedMcpId, setSelectedMcpId] = useState<string | null>(null)

  // Enterprise Settings modal state
  const [enterpriseModalOpen, setEnterpriseModalOpen] = useState(false)
  // Cloud hosting config state
  const [cloudEnv, setCloudEnv] = useState('Production')
  const [cloudRegion, setCloudRegion] = useState('us-east-1')
  const [cloudProvider, setCloudProvider] = useState('AWS')

  // Agent Analytics state
  const [analytics, setAnalytics] = useState<Array<{ id: string; name: string; [key: string]: unknown }>>([])
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)

  // Version History modal state
  const [versionModalOpen, setVersionModalOpen] = useState(false)
  const [versionList, setVersionList] = useState<Array<{ id: string; version: string; [key: string]: unknown }>>([])
  const [versionLoading, setVersionLoading] = useState(false)
  const [versionError, setVersionError] = useState<string | null>(null)

  // Vercel deployment state
  const [vercelDeploying, setVercelDeploying] = useState(false)
  const [vercelDeployUrl, setVercelDeployUrl] = useState<string | null>(null)
  const [vercelDeployError, setVercelDeployError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  // Prefill builder for agent refinement
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (searchParams.get('refine') === '1') {
      const raw = localStorage.getItem('refine-agent')
      if (raw) {
        try {
          const agent = JSON.parse(raw)
          setAgentName(agent.name || '')
          setAgentDescription(agent.description || '')
          setApiEndpoint(agent.api_endpoint || '')
          setParsedAPI(agent.configuration?.parsedAPI || null)
          setAgentPlan(agent.configuration || null)
          // If version exists, increment for redeploy
          if (agent.version) {
            // TODO: Replace 'unknown' with a specific type
            setAgentPlan((plan) => plan ? { ...plan, version: agent.version + 1 } : plan)
          }
        } catch {}
        localStorage.removeItem('refine-agent')
      }
    }
  }, [searchParams])

  // Fetch MCP servers when Deploy tab is shown
  useEffect(() => {
    // Only fetch if Deploy tab is visible (could add a state for active tab if needed)
    setMcpLoading(true)
    setMcpError(null)
    const token = typeof window !== 'undefined' ? localStorage.getItem('sb-access-token') : null
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/mcp-servers`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        setMcpServers(Array.isArray(data) ? data : [])
        if (Array.isArray(data) && data.length > 0) setSelectedMcpId(data[0].id)
      })
      .catch(() => setMcpError('Failed to fetch MCP servers'))
      .finally(() => setMcpLoading(false))
  }, [])

  useEffect(() => {
    if (composeModalOpen) {
      setTemplatesLoading(true)
      setTemplatesError(null)
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/templates`)
        .then(res => res.json())
        .then(data => setTemplates(Array.isArray(data) ? data : []))
        .catch(() => setTemplatesError('Failed to fetch templates'))
        .finally(() => setTemplatesLoading(false))
    }
  }, [composeModalOpen])

  useEffect(() => {
    if (codeModalOpen && agentPlan && apiEndpoint) {
      setCodeLoading(true)
      setCodeError(null)
      setGeneratedCode(null)
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/generate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentPlan, agentName, apiEndpoint })
      })
        .then(res => res.json())
        .then(data => {
          if (data.code) setGeneratedCode(data.code)
          else setCodeError('No code returned from backend')
        })
        .catch(err => setCodeError('Failed to fetch generated code'))
        .finally(() => setCodeLoading(false))
    }
  }, [codeModalOpen, agentPlan, agentName, apiEndpoint])

  useEffect(() => {
    if (templateLibraryOpen) {
      setLibraryLoading(true)
      setLibraryError(null)
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/templates`)
        .then(res => res.json())
        .then(data => setLibraryTemplates(Array.isArray(data) ? data : []))
        .catch(() => setLibraryError('Failed to fetch templates'))
        .finally(() => setLibraryLoading(false))
    }
  }, [templateLibraryOpen])

  useEffect(() => {
    if (enterpriseModalOpen) {
      setAnalyticsLoading(true)
      setAnalyticsError(null)
      setAnalytics([])
      const token = typeof window !== 'undefined' ? localStorage.getItem('sb-access-token') : null
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/analytics`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) setAnalytics(data)
          else setAnalyticsError(data.error || 'Failed to fetch analytics')
        })
        .catch(() => setAnalyticsError('Failed to fetch analytics'))
        .finally(() => setAnalyticsLoading(false))
    }
  }, [enterpriseModalOpen])

  // Fetch version history when modal opens
  useEffect(() => {
    if (!versionModalOpen || !agentName) return
    setVersionLoading(true)
    setVersionError(null)
    setVersionList([])
    // Find current agent id from agentPlan or parsedAPI if available
    // Fallback: skip if not available
    const agentId = (agentPlan && typeof agentPlan === 'object' && 'id' in agentPlan ? agentPlan.id : null) || (parsedAPI && typeof parsedAPI === 'object' && 'id' in parsedAPI ? parsedAPI.id : null) || null
    if (!agentId) {
      setVersionError('No agent selected')
      setVersionLoading(false)
      return
    }
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/agents/${agentId}/versions`)
      .then(res => res.json())
      .then(data => setVersionList(Array.isArray(data) ? data : []))
      .catch(() => setVersionError('Failed to fetch version history'))
      .finally(() => setVersionLoading(false))
  }, [versionModalOpen, agentName, agentPlan, parsedAPI])

  // Load a previous version into the builder
  const handleLoadVersion = async (version: { id: string; version: string; [key: string]: unknown }) => {
    setAgentName(typeof version.name === 'string' ? version.name : '')
    setAgentDescription(typeof version.description === 'string' ? version.description : '')
    setApiEndpoint(typeof version.api_endpoint === 'string' ? version.api_endpoint : '')
    setParsedAPI(version.configuration && typeof version.configuration === 'object' && 'parsedAPI' in version.configuration ? version.configuration.parsedAPI as ParsedAPI : null)
    setAgentPlan(version.configuration && typeof version.configuration === 'object' ? version.configuration as AgentPlan : null)
    setVersionModalOpen(false)
  }

  const handleAddMcpServer = async () => {
    if (!newMcpName || !newMcpUrl) return
    setMcpLoading(true)
    setMcpError(null)
    const token = typeof window !== 'undefined' ? localStorage.getItem('sb-access-token') : null
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/mcp-servers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ name: newMcpName, url: newMcpUrl })
      })
      const data = await res.json()
      if (data && data.id) {
        setMcpServers(servers => [...servers, data])
        setSelectedMcpId(data.id)
        setNewMcpName('')
        setNewMcpUrl('')
      } else {
        setMcpError('Failed to add MCP server')
      }
    } catch {
      setMcpError('Failed to add MCP server')
    } finally {
      setMcpLoading(false)
    }
  }

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
      // console.error('Failed to analyze API:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateAgent = async () => {
    if (!parsedAPI || !naturalLanguagePrompt) {
      toast.error("Please analyze an API and enter a prompt.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/plan-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parsedAPI, prompt: naturalLanguagePrompt })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate agent plan');
      }
      const plan = await res.json();
      let normalizedPlan = plan;
      if (Array.isArray(plan?.workflow)) {
        normalizedPlan = { workflow: { steps: plan.workflow } };
      }
      if (!normalizedPlan || !normalizedPlan.workflow || !Array.isArray(normalizedPlan.workflow.steps) || normalizedPlan.workflow.steps.length === 0) {
        toast.error("Failed to generate a valid agent workflow. Try rephrasing your prompt or using a different API/model.");
        setAgentPlan(null);
      } else {
        setAgentPlan(normalizedPlan);
        toast.success("Agent workflow generated!");
      }
    } catch (error) {
      toast.error(
        "Failed to generate agent workflow: " +
          (error instanceof Error ? error.message : String(error))
      );
      setAgentPlan(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestAgent = async () => {
    if (!agentPlan) return
    
    try {
      const execution = await aiIntegration.testAgent(agentPlan, "Hello, can you help me?")
      // console.log('Test execution:', execution)
      // You could show this in a modal or redirect to playground
    } catch (error) {
      // console.error('Failed to test agent:', error)
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

  const handleSuggestAPIs = async () => {
    setApiSuggestLoading(true)
    setApiSuggestError(null)
    setApiSuggestions([])
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/suggest-apis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: naturalLanguagePrompt, description: agentDescription })
      })
      const data = await res.json()
      setApiSuggestions(Array.isArray(data) ? data : [])
    } catch (err) {
      setApiSuggestError('Failed to suggest APIs')
    } finally {
      setApiSuggestLoading(false)
    }
  }

  // Deploy to Vercel handler
  const handleDeployToVercel = async () => {
    setVercelDeploying(true)
    setVercelDeployError(null)
    setVercelDeployUrl(null)
    try {
      // Get generated code from backend
      const codeRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/generate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentPlan, agentName, apiEndpoint })
      })
      const codeData = await codeRes.json()
      if (!codeData.code) throw new Error('Failed to generate code')
      // Deploy to Vercel
      const deployRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/deploy/vercel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeData.code, agentName })
      })
      const deployData = await deployRes.json()
      if (deployData.url) setVercelDeployUrl(deployData.url)
      else throw new Error(deployData.error || 'Vercel deployment failed')
    } catch (err: unknown) {
      setVercelDeployError(err instanceof Error ? err.message : 'Deployment failed')
    } finally {
      setVercelDeploying(false)
    }
  }

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
            <Button variant="outline" onClick={() => setVersionModalOpen(true)}>
              Version History
            </Button>
            <Button variant="outline" onClick={() => setEnterpriseModalOpen(true)}>
              Enterprise Settings
            </Button>
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
                    <Button
                      onClick={handleSuggestAPIs}
                      disabled={apiSuggestLoading || (!naturalLanguagePrompt && !agentDescription)}
                      className="w-full mt-2"
                    >
                      {apiSuggestLoading ? 'Suggesting APIs...' : 'Suggest APIs'}
                    </Button>
                    {apiSuggestError && <div className="text-red-400 text-xs mt-1">{apiSuggestError}</div>}
                    {apiSuggestions.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <div className="font-semibold text-xs text-gray-700">Suggested APIs:</div>
                        {apiSuggestions.map((api) => (
                          <div
                            key={api.id}
                            className="p-2 border rounded cursor-pointer hover:bg-blue-50"
                            onClick={() => {
                              setSelectedAPI(api.id)
                              setApiEndpoint(typeof api.url === 'string' ? api.url : '')
                            }}
                          >
                            <div className="font-medium">{typeof api.name === 'string' ? api.name : 'Unknown API'}</div>
                            <div className="text-xs text-gray-500">{typeof api.description === 'string' ? api.description : 'No description'}</div>
                            <div className="text-xs text-blue-700">{typeof api.url === 'string' ? api.url : 'No URL'}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
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
                    {/* MCP Server Management Section */}
                    <div className="mb-6">
                      <div className="font-semibold mb-2">MCP Server Management</div>
                      <div className="space-y-2 mb-2">
                        {mcpLoading ? (
                          <div>Loading MCP servers...</div>
                        ) : mcpError ? (
                          <div className="text-red-400 text-xs">{mcpError}</div>
                        ) : mcpServers.length === 0 ? (
                          <div className="text-xs text-gray-500">No MCP servers found.</div>
                        ) : (
                          mcpServers.map((server: { id: string; name: string; url: string }) => (
                            <label key={server.id} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="mcp-server"
                                checked={selectedMcpId === server.id}
                                onChange={() => setSelectedMcpId(server.id)}
                              />
                              <span className="font-medium">{server.name}</span>
                              <span className="text-xs text-gray-500">{server.url}</span>
                            </label>
                          ))
                        )}
                      </div>
                      <div className="flex space-x-2 mb-2">
                        <input
                          className="border p-1 rounded text-xs flex-1"
                          placeholder="Server Name"
                          value={newMcpName}
                          onChange={e => setNewMcpName(e.target.value)}
                        />
                        <input
                          className="border p-1 rounded text-xs flex-1"
                          placeholder="Server URL"
                          value={newMcpUrl}
                          onChange={e => setNewMcpUrl(e.target.value)}
                        />
                        <Button
                          size="sm"
                          onClick={handleAddMcpServer}
                          disabled={mcpLoading || !newMcpName || !newMcpUrl}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    {/* End MCP Server Management Section */}
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
                          <span className="ml-2 text-xs text-gray-500">MCP: {mcpServers.find(s => s.id === selectedMcpId)?.name}</span>
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
                      <Button
                        className="w-full bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-900 hover:to-gray-700"
                        onClick={handleDeployToVercel}
                        disabled={!agentPlan || vercelDeploying}
                      >
                        {vercelDeploying ? 'Deploying to Vercel...' : 'Deploy to Vercel'}
                      </Button>
                      {vercelDeployUrl && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                          <span className="font-semibold text-blue-700">Vercel Deployment URL:</span><br />
                          <a href={vercelDeployUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{vercelDeployUrl}</a>
                        </div>
                      )}
                      {vercelDeployError && (
                        <div className="mt-2 text-xs text-red-600">{vercelDeployError}</div>
                      )}
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
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setCodeModalOpen(true)}
                  disabled={!agentPlan}
                >
                  <Code className="w-4 h-4 mr-2" />
                  View Generated Code
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setComposeModalOpen(true)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Compose Agent
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setTemplateLibraryOpen(true)}
                >
                  <Code className="w-4 h-4 mr-2" />
                  Browse Templates
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
      <Dialog open={codeModalOpen} onOpenChange={setCodeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generated Agent Code</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-auto bg-gray-900 text-green-200 rounded p-4 text-xs">
            {codeLoading ? (
              <div>Loading...</div>
            ) : codeError ? (
              <div className="text-red-400">{codeError}</div>
            ) : generatedCode ? (
              <pre>{generatedCode}</pre>
            ) : agentPlan ? (
              <pre>{JSON.stringify(agentPlan, null, 2)}</pre>
            ) : (
              <div>No agent plan available.</div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setCodeModalOpen(false)} className="w-full mt-4">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={composeModalOpen} onOpenChange={setComposeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compose Agent from Templates</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-auto">
            {templatesLoading ? (
              <div>Loading templates...</div>
            ) : templatesError ? (
              <div className="text-red-400">{templatesError}</div>
            ) : templates.length === 0 ? (
              <div>No templates found.</div>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {templates.map((tpl) => (
                    <label key={tpl.id} className="flex items-center space-x-2 p-2 border rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTemplateIds.includes(tpl.id)}
                        onChange={e => {
                          setSelectedTemplateIds(ids =>
                            e.target.checked
                              ? [...ids, tpl.id]
                              : ids.filter(id => id !== tpl.id)
                          )
                        }}
                      />
                      <span className="font-medium">{typeof tpl.name === 'string' ? tpl.name : (typeof tpl.title === 'string' ? tpl.title : `Template ${tpl.id}`)}</span>
                      <span className="text-xs text-gray-500">{typeof tpl.description === 'string' ? tpl.description : 'No description'}</span>
                    </label>
                  ))}
                </div>
                {selectedTemplateIds.length > 0 && (
                  <div className="mb-4 p-2 bg-gray-100 rounded">
                    <div className="font-semibold mb-1">Preview:</div>
                    {selectedTemplateIds.map(id => {
                      const tpl = templates.find(t => t.id === id)
                      return tpl ? (
                        <div key={id} className="mb-2">
                          <div className="font-medium">{typeof tpl.name === 'string' ? tpl.name : (typeof tpl.title === 'string' ? tpl.title : 'Untitled Template')}</div>
                          <div className="text-xs text-gray-600">{typeof tpl.description === 'string' ? tpl.description : 'No description'}</div>
                          {tpl.configuration && typeof tpl.configuration === 'object' && 'workflow' in tpl.configuration && tpl.configuration.workflow && typeof tpl.configuration.workflow === 'object' && 'steps' in tpl.configuration.workflow && Array.isArray(tpl.configuration.workflow.steps) ? (
                            <ul className="list-disc ml-5 text-xs text-gray-700">
                              {tpl.configuration.workflow.steps.map((step: { name?: string; type?: string }, i: number) => (
                                <li key={i}>{step.name || step.type || `Step ${i+1}`}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ) : null
                    })}
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button 
              onClick={() => {
                // For now, just import the first selected template
                const tpl = templates.find(t => t.id === selectedTemplateIds[0])
                if (tpl && tpl.configuration) {
                  setAgentPlan(tpl.configuration && typeof tpl.configuration === 'object' ? tpl.configuration as AgentPlan : null)
                  setAgentName(typeof tpl.name === 'string' ? tpl.name : (typeof tpl.title === 'string' ? tpl.title : ''))
                  setAgentDescription(typeof tpl.description === 'string' ? tpl.description : '')
                }
                setComposeModalOpen(false)
                setSelectedTemplateIds([])
              }}
              className="w-full mt-2"
              disabled={selectedTemplateIds.length === 0}
            >
              Import Selected
            </Button>
            <Button onClick={() => setComposeModalOpen(false)} className="w-full mt-2">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}