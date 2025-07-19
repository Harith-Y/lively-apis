'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { 
  Play, 
  ArrowRight, 
  DollarSign, 
  MessageSquare,
  CheckCircle,
  Star,
  Zap,
  Target,
  Timer,
  Sparkles,
  BarChart3
} from 'lucide-react'
import { customerServiceScenario, demoInteractions, realTimeMetrics, competitorComparison } from '@/lib/demo-scenario'
import Link from 'next/link'

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedInteraction, setSelectedInteraction] = useState(0)
  const [metrics, setMetrics] = useState(realTimeMetrics)

  // Walkthrough state
  const [activeTab, setActiveTab] = useState('overview')
  const [walkthroughStep, setWalkthroughStep] = useState(0)
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false)
  const walkthroughInterval = useRef<NodeJS.Timeout | null>(null)
  const liveDemoInterval = useRef<NodeJS.Timeout | null>(null)
  const [liveDemoIndex, setLiveDemoIndex] = useState(0)

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        currentUsers: prev.currentUsers + Math.floor(Math.random() * 3) - 1,
        todayInteractions: prev.todayInteractions + Math.floor(Math.random() * 5),
        costSavingsToday: prev.costSavingsToday + Math.floor(Math.random() * 50),
        ticketsResolved: prev.ticketsResolved + Math.floor(Math.random() * 3)
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scenario = customerServiceScenario
  // Debug: Log timeline on mount
  useEffect(() => {
    // console.log('TIMELINE:', scenario.timeline)
  }, [])
  const beforeAfterSavings = scenario.beforeMetrics.monthlyCost - scenario.afterMetrics.monthlyCost
  const roiPercentage = Math.round((beforeAfterSavings / scenario.afterMetrics.monthlyCost) * 100)

  // Walkthrough steps:
  // 0: Overview timeline animation
  // 1: Before/After highlight
  // 2: Live Demo highlight
  // 3: Metrics highlight
  // 4: Comparison highlight
  // 5: End

  // Start the walkthrough
  const startWalkthrough = () => {
    setIsWalkthroughActive(true)
    setActiveTab('overview')
    setWalkthroughStep(0)
    setIsPlaying(true)
    setCurrentStep(0)
    setLiveDemoIndex(0)
  }

  // Walkthrough effect
  useEffect(() => {
    if (!isWalkthroughActive) return
    if (walkthroughStep === 0) {
      // Animate timeline in overview
      setActiveTab('overview')
      setIsPlaying(true)
      setCurrentStep(0)
      if (walkthroughInterval.current) clearInterval(walkthroughInterval.current)
      walkthroughInterval.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= scenario.timeline.length - 1) {
            clearInterval(walkthroughInterval.current!)
            setTimeout(() => setWalkthroughStep(1), 3000) // 3s delay before next tab
            return prev
          }
          return prev + 1
        })
      }, 1200)
    } else if (walkthroughStep === 1) {
      // Before/After highlight
      setActiveTab('before-after')
      setIsPlaying(false)
      setTimeout(() => setWalkthroughStep(2), 3000) // 3s delay
    } else if (walkthroughStep === 2) {
      // Live Demo highlight: animate through all sample queries
      setActiveTab('live-demo')
      setIsPlaying(false)
      setLiveDemoIndex(0)
      setSelectedInteraction(0)
      if (liveDemoInterval.current) clearInterval(liveDemoInterval.current)
      let i = 0
      liveDemoInterval.current = setInterval(() => {
        i++
        if (i < demoInteractions.length) {
          setLiveDemoIndex(i)
          setSelectedInteraction(i)
        } else {
          clearInterval(liveDemoInterval.current!)
          setTimeout(() => setWalkthroughStep(3), 2000) // 2s after last sample
        }
      }, 1500)
    } else if (walkthroughStep === 3) {
      // Metrics highlight
      setActiveTab('metrics')
      setIsPlaying(false)
      setTimeout(() => setWalkthroughStep(4), 3000) // 3s delay
    } else if (walkthroughStep === 4) {
      // Comparison highlight
      setActiveTab('comparison')
      setIsPlaying(false)
      setTimeout(() => setWalkthroughStep(5), 3000) // 3s delay
    } else if (walkthroughStep === 5) {
      // End walkthrough
      setIsPlaying(false)
    }
    return () => {
      if (walkthroughInterval.current) clearInterval(walkthroughInterval.current)
      if (liveDemoInterval.current) clearInterval(liveDemoInterval.current)
    }
  }, [walkthroughStep, isWalkthroughActive])

  // Optionally disable manual tab switching during walkthrough
  const handleTabChange = (val: string) => {
    if (isWalkthroughActive) return
    setActiveTab(val)
  }

  // Highlight helpers
  const highlightClass = 'ring-4 ring-blue-400 ring-opacity-60 transition-all duration-500'

  // Close walkthrough complete popup
  const handleCloseWalkthrough = () => {
    setWalkthroughStep(0)
    setIsWalkthroughActive(false)
    setIsPlaying(false)
    setCurrentStep(0)
    setActiveTab('overview')
    setLiveDemoIndex(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Live Demo Experience
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Customer Service{' '}
            <span className="gradient-text">Transformation</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See how TechMart reduced support costs by <strong>73%</strong> while improving 
            customer satisfaction from <strong>3.2 to 4.7 stars</strong> in just one day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={startWalkthrough}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4"
              disabled={isWalkthroughActive}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Interactive Demo
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4">
              <Link href="/playground">
                Try Live Agent
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Key Metrics Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-white/30"
            >
              <div className="text-2xl font-bold text-green-600">73%</div>
              <div className="text-sm text-gray-600">Cost Reduction</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-white/30"
            >
              <div className="text-2xl font-bold text-blue-600">28s</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-white/30"
            >
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <div className="text-sm text-gray-600">Resolution Rate</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-white/30"
            >
              <div className="text-2xl font-bold text-orange-600">367%</div>
              <div className="text-sm text-gray-600">ROI</div>
            </motion.div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="before-after">Before/After</TabsTrigger>
            <TabsTrigger value="live-demo">Live Demo</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Scenario Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    The Challenge
                  </CardTitle>
                  <CardDescription>
                    TechMart&quot;s customer service was struggling with scale
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-2xl font-bold text-red-600">4.2h</div>
                      <div className="text-sm text-red-700">Response Time</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-2xl font-bold text-red-600">$68K</div>
                      <div className="text-sm text-red-700">Monthly Cost</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      12 full-time support agents
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      450 tickets per day
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      67% first-contact resolution
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      3.2/5 customer satisfaction
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Solution Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2" />
                    The Solution
                  </CardTitle>
                  <CardDescription>
                    LivelyAPI&quot;s AI-powered customer service transformation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600">28s</div>
                      <div className="text-sm text-green-700">Response Time</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600">$18.5K</div>
                      <div className="text-sm text-green-700">Monthly Cost</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                      3 human agents + AI support
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                      450 tickets per day (same volume)
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                      94% first-contact resolution
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3" />
                      4.7/5 customer satisfaction
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Implementation Timeline */}
            <Card className={isWalkthroughActive && walkthroughStep === 0 ? highlightClass : ''}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Timer className="w-5 h-5 mr-2" />
                  Implementation Timeline
                </CardTitle>
                <CardDescription>
                  From setup to production in less than 4 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scenario.timeline.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center p-4 rounded-lg border ${
                        isPlaying && currentStep >= index
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                        isPlaying && currentStep >= index
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isPlaying && currentStep >= index ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          step.step
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{step.title}</div>
                        <div className="text-sm text-gray-600">{step.description}</div>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {step.duration}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Before/After Tab */}
          <TabsContent value="before-after" className="space-y-8">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${isWalkthroughActive && walkthroughStep === 1 ? highlightClass : ''}`}>
              {/* Before */}
              <Card className="border-red-200">
                <CardHeader className="bg-red-50">
                  <CardTitle className="text-red-800">Before LivelyAPI</CardTitle>
                  <CardDescription className="text-red-600">
                    Traditional customer support challenges
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-xl font-bold text-red-600">{scenario.beforeMetrics.responseTime}</div>
                      <div className="text-xs text-red-700">Response Time</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-xl font-bold text-red-600">{scenario.beforeMetrics.resolutionRate}%</div>
                      <div className="text-xs text-red-700">Resolution Rate</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-xl font-bold text-red-600">${scenario.beforeMetrics.monthlyCost.toLocaleString()}</div>
                      <div className="text-xs text-red-700">Monthly Cost</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-xl font-bold text-red-600">{scenario.beforeMetrics.customerSatisfaction}/5</div>
                      <div className="text-xs text-red-700">Satisfaction</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• {scenario.beforeMetrics.agentCount} full-time support agents</div>
                    <div>• {scenario.beforeMetrics.ticketsPerDay} tickets per day</div>
                    <div>• High operational costs</div>
                    <div>• Inconsistent response quality</div>
                    <div>• Limited availability (business hours only)</div>
                  </div>
                </CardContent>
              </Card>

              {/* After */}
              <Card className="border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-green-800">After LivelyAPI</CardTitle>
                  <CardDescription className="text-green-600">
                    AI-powered customer service excellence
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{scenario.afterMetrics.responseTime}</div>
                      <div className="text-xs text-green-700">Response Time</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{scenario.afterMetrics.resolutionRate}%</div>
                      <div className="text-xs text-green-700">Resolution Rate</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">${scenario.afterMetrics.monthlyCost.toLocaleString()}</div>
                      <div className="text-xs text-green-700">Monthly Cost</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{scenario.afterMetrics.customerSatisfaction}/5</div>
                      <div className="text-xs text-green-700">Satisfaction</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>• {scenario.afterMetrics.agentCount} human agents + AI support</div>
                    <div>• {scenario.afterMetrics.ticketsPerDay} tickets per day (same volume)</div>
                    <div>• 24/7 instant availability</div>
                    <div>• Consistent, accurate responses</div>
                    <div>• Seamless API integrations</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ROI Calculation */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Business Impact Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ${beforeAfterSavings.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Monthly Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {roiPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">ROI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      ${(beforeAfterSavings * 12).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Annual Savings</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="live-demo" className="space-y-8">
            <Card className={isWalkthroughActive && walkthroughStep === 2 ? highlightClass : ''}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Try the Live Agent
                </CardTitle>
                <CardDescription>
                  Test real customer service scenarios with instant responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Sample Interactions */}
                  <div className="lg:col-span-1 space-y-3">
                    <h4 className="font-medium text-gray-900 mb-3">Sample Queries</h4>
                    {demoInteractions.map((interaction, index) => (
                      <Button
                        key={interaction.id}
                        variant={selectedInteraction === index ? "default" : "outline"}
                        size="sm"
                        className={`w-full text-left justify-start text-xs h-auto p-3 ${(isWalkthroughActive && walkthroughStep === 2 && liveDemoIndex === index) ? 'ring-2 ring-blue-400' : ''}`}
                        onClick={() => setSelectedInteraction(index)}
                        disabled={isWalkthroughActive}
                      >
                        &quot;{interaction.userQuery}&quot;
                      </Button>
                    ))}
                  </div>

                  {/* Chat Interface */}
                  <div className="lg:col-span-2">
                    <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px] flex flex-col">
                      <div className="flex-1 space-y-4">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="bg-purple-600 text-white p-3 rounded-lg max-w-xs">
                            <p className="text-sm">&quot;{demoInteractions[selectedInteraction].userQuery}&quot;</p>
                          </div>
                        </div>

                        {/* Agent Response */}
                        <div className="flex justify-start">
                          <div className="bg-white p-3 rounded-lg max-w-md border">
                            <div className="flex items-center mb-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-2">
                                <MessageSquare className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-xs text-gray-500">AI Agent</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {demoInteractions[selectedInteraction].responseTime}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-800">
                              &quot;{demoInteractions[selectedInteraction].agentResponse}&quot;
                            </p>
                            
                            {/* API Calls */}
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="text-xs text-gray-500 mb-1">API Calls Made:</div>
                              <div className="space-y-1">
                                {demoInteractions[selectedInteraction].apiCalls.map((call, i) => (
                                  <div key={i} className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                    {call}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Satisfaction */}
                            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3 h-3 ${
                                      i < demoInteractions[selectedInteraction].satisfaction 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">Customer Rating</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Real-time Metrics Tab */}
          <TabsContent value="metrics" className="space-y-8">
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${isWalkthroughActive && walkthroughStep === 3 ? highlightClass : ''}`}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{metrics.currentUsers}</div>
                  <div className="text-xs text-gray-500">Currently online</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Today&apos;s Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{metrics.todayInteractions.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">+{Math.floor(Math.random() * 20) + 10}% vs yesterday</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{metrics.avgResponseTime}s</div>
                  <div className="text-xs text-gray-500">99.8% faster than before</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Cost Savings Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">${metrics.costSavingsToday.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">vs traditional support</div>
                </CardContent>
              </Card>
            </div>

            {/* Customer Testimonial */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {scenario.testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-lg text-gray-800 mb-4 italic">
                      That&apos;s amazing! How has this impacted their business?
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{scenario.testimonial.name}</div>
                        <div className="text-sm text-gray-600">{scenario.testimonial.role}</div>
                        <div className="text-sm text-purple-600">{scenario.testimonial.company}</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {scenario.testimonial.metrics}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-8">
            <Card className={isWalkthroughActive && walkthroughStep === 4 ? highlightClass : ''}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Competitive Comparison
                </CardTitle>
                <CardDescription>
                  See how LivelyAPI compares to traditional solutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Feature</th>
                        <th className="text-center p-4 bg-purple-50 rounded-t-lg">
                          <div className="font-bold text-purple-600">LivelyAPI</div>
                        </th>
                        <th className="text-center p-4">Zendesk</th>
                        <th className="text-center p-4">Intercom</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(competitorComparison.livelyapi).map(([key, value]) => (
                        <tr key={key} className="border-b">
                          <td className="p-4 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</td>
                          <td className="text-center p-4 bg-purple-50">
                            <Badge className="bg-purple-600 text-white">{value}</Badge>
                          </td>
                          <td className="text-center p-4">{competitorComparison.zendesk[key as keyof typeof competitorComparison.zendesk]}</td>
                          <td className="text-center p-4">{competitorComparison.intercom[key as keyof typeof competitorComparison.intercom]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Customer Service?</h3>
                <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                  Join hundreds of companies that have already reduced costs by 70%+ while improving customer satisfaction.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/builder">
                      Start Building Your Agent
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                    Schedule Demo Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {/* Walkthrough End Message */}
        {walkthroughStep === 5 && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-blue-400 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-blue-600 text-xl font-bold"
                onClick={handleCloseWalkthrough}
                aria-label="Close walkthrough"
                autoFocus
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-2 text-blue-700">Walkthrough Complete!</h2>
              <p className="text-gray-700">You&apos;ve seen all the key features. Try exploring or building your own agent!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}