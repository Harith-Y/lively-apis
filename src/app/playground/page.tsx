'use client'

import { demoAgents } from '@/lib/demo-data'
const agents = demoAgents
const defaultAgentId = agents[0]?.id || 'ecommerce-assistant'

import { useState, useEffect, useCallback, useRef } from 'react'
import { APIAnalyzer } from '@/lib/api-analyzer'
import { AgentPlanner, AgentPlan } from '@/lib/agent-planner'

import { 
  Send, 
  RotateCcw, 
  Settings,
  MessageSquare,
  BarChart3,
  Clock,
  Sparkles
} from 'lucide-react'
import { LocalTime } from '@/components/ui/LocalTime';
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
}

interface Feedback {
  id: string
  agent_id: string
  feedback: string
  rating: number
  created_at: string | Date
}

interface ApiCredentials {
  apiKey: string
}

export default function PlaygroundPage() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'
  
  // Debug logging
  console.log('PlaygroundPage: agents loaded:', agents.length, 'defaultAgentId:', defaultAgentId)
  
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
  const [selectedAgent] = useState(defaultAgentId)
  const [messages, setMessages] = useState<Message[]>(chats[defaultAgentId])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [agentPlan, setAgentPlan] = useState<AgentPlan | null>(null)
  const [apiCredentials] = useState<ApiCredentials>({ apiKey: '' })

  // Playground settings state
  const [temperature] = useState<number>(0.7)
  const [maxTokens] = useState<number>(1000)
  const [provider] = useState<'openai' | 'claude' | 'openrouter'>('openrouter')

  // Voice input state
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Feedback modal state
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackRating, setFeedbackRating] = useState<number>(5)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)
  const [feedbackList, setFeedbackList] = useState<Array<{id: string, feedback: string, rating: number, created_at: string}>>([])
  const [feedbackListLoading, setFeedbackListLoading] = useState(false)

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'

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
  }, [selectedAgent, chats, agents])

  // When messages change, update chat history for the current agent
  useEffect(() => {
    setChats(prev => ({ ...prev, [selectedAgent]: messages }))
  }, [messages, selectedAgent])

  // Fetch feedback for selected agent
  useEffect(() => {
    if (!feedbackOpen) return
    setFeedbackListLoading(true)
    fetch(`${BACKEND_URL}/agent-feedback/${selectedAgent}`)
      .then(res => res.json())
      .then(data => setFeedbackList(Array.isArray(data) ? data : []))
      .catch(() => setFeedbackList([]))
      .finally(() => setFeedbackListLoading(false))
  }, [feedbackOpen, selectedAgent, BACKEND_URL])

  // Submit feedback
  const handleSubmitFeedback = async () => {
    setFeedbackLoading(true)
    setFeedbackError(null)
    const token = typeof window !== 'undefined' ? localStorage.getItem('sb-access-token') : null
    try {
      const res = await fetch(`${BACKEND_URL}/agent-feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ agent_id: selectedAgent, feedback: feedbackText, rating: feedbackRating })
      })
      const data = await res.json()
      if (data && !data.error) {
        setFeedbackText('')
        setFeedbackRating(5)
        setFeedbackList(prev => [data, ...prev])
        setFeedbackOpen(false)
      } else {
        setFeedbackError(data.error || 'Failed to submit feedback')
      }
    } catch {
      setFeedbackError('Failed to submit feedback')
    } finally {
      setFeedbackLoading(false)
    }
  }

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
      toast.error('Failed to initialize demo agent: ' + (error instanceof Error ? error.message : String(error)))
    }
  }, [selectedAgent])

  useEffect(() => {
    initializeDemoAgent()
  }, [initializeDemoAgent])

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
            maxTokens,
            provider,
            apiKey: apiCredentials.apiKey || undefined
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
      toast.error('Failed to get agent response: ' + (error instanceof Error ? error.message : String(error)))
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

  // Voice input (speech-to-text)
  const handleStartRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser.')
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputMessage(transcript)
      setIsRecording(false)
    }
    recognition.onerror = () => setIsRecording(false)
    recognition.onend = () => setIsRecording(false)
    recognitionRef.current = recognition
    setIsRecording(true)
    recognition.start()
  }
  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  // TTS (Groq API via backend)
  const handlePlayTTS = async (text: string, id: string) => {
    setTtsLoadingId(id)
    try {
      const res = await fetch(`${BACKEND_URL}/tts/groq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'alloy', model: 'tts-1' })
      })
      const data = await res.json()
      if (data && data.audio_url) {
        if (audioRef.current) audioRef.current.pause()
        audioRef.current = new Audio(data.audio_url)
        audioRef.current.play()
      } else {
        toast.error('TTS failed')
      }
    } catch {
      toast.error('TTS failed')
    } finally {
      setTtsLoadingId(null)
    }
  }

  const router = useRouter()
  // Refine Agent logic
  const handleRefineAgent = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/agents/${selectedAgent}`)
      const data = await res.json()
      if (data && !data.error) {
        // Pass agent config to /builder via query or state (here, use localStorage for simplicity)
        localStorage.setItem('refine-agent', JSON.stringify(data))
        router.push('/builder?refine=1')
      } else {
        toast.error('Failed to load agent for refinement')
      }
    } catch {
      toast.error('Failed to load agent for refinement')
    }
  }

  // Safety check - if no agents loaded, show error
  if (!agents || agents.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Playground</h1>
          <p className="text-gray-600">No demo agents found. Please check the demo data configuration.</p>
        </div>
      </div>
    )
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
          <div className="flex space-x-3 items-center w-full sm:w-auto mt-4 sm:mt-0">
            <select
              className="border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={provider}
              onChange={e => setProvider(e.target.value as 'openai' | 'claude' | 'openrouter')}
              style={{ minWidth: 120 }}
            >
              <option value="openai">OpenAI</option>
              <option value="claude">Claude</option>
              <option value="openrouter">OpenRouter</option>
            </select>
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
            <div className="bg-white rounded-lg shadow p-6 flex flex-col h-[70vh]">
              <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex mb-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-lg ${msg.type === 'user' ? 'bg-purple-100 text-right' : 'bg-gray-100 text-left'} relative`}>
                      {msg.type === 'agent' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-[-36px] top-1"
                          onClick={() => handlePlayTTS(msg.content, msg.id)}
                          disabled={ttsLoadingId === msg.id}
                          title="Play response"
                        >
                          {ttsLoadingId === msg.id ? <span className="animate-spin">🔊</span> : <span>🔊</span>}
                        </Button>
                      )}
                      <div className="whitespace-pre-line">{msg.content}</div>
                      <div className="text-xs text-gray-400 mt-1">{msg.type === 'user' ? 'You' : 'Agent'} • <LocalTime date={msg.timestamp} /></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center space-x-2 mt-auto">
                <Input
                  className="flex-1"
                  placeholder={isRecording ? 'Listening...' : 'Type your message...'}
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !isRecording && handleSendMessage()}
                  disabled={isLoading || isRecording}
                />
                <Button
                  variant={isRecording ? 'destructive' : 'outline'}
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  disabled={isLoading}
                  title={isRecording ? 'Stop Recording' : 'Voice Input'}
                >
                  {isRecording ? <span>⏹️</span> : <span>🎤</span>}
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || isRecording || !inputMessage.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>
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
                      name="api-key"
                      autoComplete="new-password"
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
                      <span className="font-medium">{agent.name}</span>
                      {selectedAgent === agent.id && (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={handleRefineAgent}>
                            Refine Agent
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setFeedbackOpen(true)}>
                            Leave Feedback
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{agent.description}</div>
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
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Feedback for Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Feedback</label>
              <textarea
                className="w-full border border-gray-300 rounded p-2"
                rows={3}
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                disabled={feedbackLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                className="w-full border border-gray-300 rounded p-2"
                value={feedbackRating}
                onChange={e => setFeedbackRating(Number(e.target.value))}
                disabled={feedbackLoading}
              >
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            {feedbackError && <div className="text-red-500 text-xs">{feedbackError}</div>}
            <DialogFooter>
              <Button onClick={handleSubmitFeedback} disabled={feedbackLoading || !feedbackText.trim()} className="w-full">
                {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </DialogFooter>
            <div className="mt-4">
              <div className="font-semibold mb-2">Previous Feedback</div>
              {feedbackListLoading ? (
                <div>Loading...</div>
              ) : feedbackList.length === 0 ? (
                <div className="text-xs text-gray-500">No feedback yet.</div>
              ) : (
                <ul className="space-y-2 max-h-40 overflow-auto">
                  {feedbackList.map(fb => (
                    <li key={fb.id} className="border rounded p-2">
                      <div className="text-xs text-gray-700 mb-1">{fb.feedback}</div>
                      <div className="text-xs text-gray-500">Rating: {fb.rating || 'N/A'} • {new Date(fb.created_at).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
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