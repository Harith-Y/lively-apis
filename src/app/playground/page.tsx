'use client'

import { demoAgents } from '@/lib/demo-data'
const agents = demoAgents
const defaultAgentId = agents[0]?.id || 'customer-support'

import { useState, useEffect, useCallback, useRef } from 'react'
import { APIAnalyzer } from '@/lib/api-analyzer'
import { AgentPlanner, AgentPlan } from '@/lib/agent-planner'
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
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([])
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
  }, [selectedAgent, chats])

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
  const SpeechRecognition = (window as typeof window & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition || (window as typeof window & { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
  recognitionRef.current = new (SpeechRecognition as unknown as { new (): SpeechRecognition })()
  recognitionRef.current.lang = 'en-US'
  recognitionRef.current.interimResults = false
  recognitionRef.current.maxAlternatives = 1
  recognitionRef.current.onresult = (event: unknown) => {
    if (typeof event === 'object' && event && 'results' in event) {
      const results = (event as { results: { [key: number]: { [key: number]: { transcript: string } } } }).results;
      const transcript = results[0][0].transcript;
      setInputMessage(transcript);
      setIsRecording(false);
    }
  }
  recognitionRef.current.onend = () => setIsRecording(false)
  recognitionRef.current.onerror = () => setIsRecording(false)
  recognitionRef.current.start()
  setIsRecording(true)
}

function getTestScenarios(): string[] {
  switch (selectedAgent) {
    case 'customer-support':
      return [
        'Get order status',
        'Cancel order',
        'Update shipping address',
        'Get product information',
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









return (
  <div className="min-h-screen bg-gray-50">
    {/* ...rest of the code... */}
  </div>
)
}