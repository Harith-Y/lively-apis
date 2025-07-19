'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Rocket, 
  Copy, 
  ExternalLink, 
  Settings, 
  Globe,
  Code,
  Monitor,
  CheckCircle,
  Clock,
  Users,
  BarChart3
} from 'lucide-react'
import { deploymentTemplates } from '@/lib/demo-data'

export default function DeployPage() {
  const [selectedAgent, setSelectedAgent] = useState('ecommerce-assistant')
  const [deploymentUrl, setDeploymentUrl] = useState('')
  const [isDeploying, setIsDeploying] = useState(false)
  const [isDeployed, setIsDeployed] = useState(false)

  const agents = [
    { id: 'ecommerce-assistant', name: 'E-commerce Assistant', status: 'ready' },
    { id: 'payment-processor', name: 'Payment Processor', status: 'ready' },
    { id: 'team-communicator', name: 'Team Communicator', status: 'ready' }
  ]

  const handleDeploy = async () => {
    setIsDeploying(true)
    // Simulate deployment
    setTimeout(() => {
      setIsDeploying(false)
      setIsDeployed(true)
      setDeploymentUrl(`https://agent-${selectedAgent}-${Math.random().toString(36).substr(2, 9)}.livelyapi.com`)
    }, 3000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Deploy Your Agent</h1>
            <p className="text-gray-600">One-click deployment with monitoring and analytics</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={handleDeploy}
              disabled={isDeploying || isDeployed}
            >
              <Rocket className="w-4 h-4 mr-2" />
              {isDeploying ? 'Deploying...' : isDeployed ? 'Deployed' : 'Deploy Agent'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Deployment Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agent Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Agent to Deploy</CardTitle>
                <CardDescription>
                  Choose which agent you want to deploy to production
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAgent === agent.id
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAgent(agent.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{agent.name}</span>
                        <Badge className="bg-green-100 text-green-800">
                          {agent.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deployment Status */}
            {(isDeploying || isDeployed) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {isDeploying ? (
                      <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    )}
                    Deployment Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isDeploying ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                        <span>Building agent container...</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <span className="text-gray-500">Deploying to production...</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <span className="text-gray-500">Setting up monitoring...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-green-800 font-medium">Deployment Successful!</span>
                        </div>
                        <p className="text-green-700 text-sm mt-1">
                          Your agent is now live and ready to handle requests.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Agent URL
                        </label>
                        <div className="flex space-x-2">
                          <Input value={deploymentUrl} readOnly />
                          <Button variant="outline" onClick={() => copyToClipboard(deploymentUrl)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" asChild>
                            <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Integration Options */}
            <Tabs defaultValue="webhook" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="webhook">Webhook</TabsTrigger>
                <TabsTrigger value="widget">Chat Widget</TabsTrigger>
                <TabsTrigger value="api">REST API</TabsTrigger>
              </TabsList>

              {deploymentTemplates.map((template) => (
                <TabsContent key={template.id} value={template.id.replace('-integration', '').replace('-', '')}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Integration Code
                          </label>
                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                              <code>{template.code}</code>
                            </pre>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(template.code)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Deployment Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
                <CardDescription>
                  Deployment settings and options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Environment
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option>Production</option>
                    <option>Staging</option>
                    <option>Development</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Domain
                  </label>
                  <Input placeholder="agent.yourcompany.com" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate Limit
                  </label>
                  <Input placeholder="1000 requests/hour" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="analytics" className="rounded" defaultChecked />
                  <label htmlFor="analytics" className="text-sm text-gray-700">
                    Enable analytics
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="monitoring" className="rounded" defaultChecked />
                  <label htmlFor="monitoring" className="text-sm text-gray-700">
                    Enable monitoring
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Live Metrics */}
            {isDeployed && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="w-5 h-5 mr-2" />
                    Live Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Status</span>
                    </div>
                    <span className="font-medium text-green-600">Online</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Active Users</span>
                    </div>
                    <span className="font-medium">23</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Requests/min</span>
                    </div>
                    <span className="font-medium">47</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Avg Response</span>
                    </div>
                    <span className="font-medium">1.2s</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" disabled={!isDeployed}>
                  <Globe className="w-4 h-4 mr-2" />
                  View Live Agent
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled={!isDeployed}>
                  <Monitor className="w-4 h-4 mr-2" />
                  Monitoring Dashboard
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled={!isDeployed}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Code className="w-4 h-4 mr-2" />
                  API Documentation
                </Button>
              </CardContent>
            </Card>

            {/* Deployment History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Deployments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <div className="font-medium text-green-800 text-sm">v1.2.3</div>
                      <div className="text-xs text-green-600">2 minutes ago</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800 text-sm">v1.2.2</div>
                      <div className="text-xs text-gray-600">2 hours ago</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800 text-sm">v1.2.1</div>
                      <div className="text-xs text-gray-600">1 day ago</div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}