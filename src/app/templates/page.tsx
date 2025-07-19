'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  CreditCard, 
  MessageSquare, 
  Play, 
  Copy,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { demoAgents } from '@/lib/demo-data'
import Link from 'next/link'

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const getIcon = (category: string) => {
    switch (category) {
      case 'ecommerce':
        return ShoppingCart
      case 'payments':
        return CreditCard
      case 'communication':
        return MessageSquare
      default:
        return null
    }
  }

  const getColor = (category: string) => {
    switch (category) {
      case 'ecommerce':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'payments':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'communication':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pre-built Agent Templates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started instantly with our professionally designed AI agents. 
            Each template includes sample data, working demos, and proven workflows.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {demoAgents.map((agent) => {
            const Icon = getIcon(agent.category)
            const isSelected = selectedTemplate === agent.id
            
            return (
              <Card 
                key={agent.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-purple-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedTemplate(agent.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      {Icon && <Icon className="w-6 h-6 text-white" />}
                    </div>
                    <Badge className={getColor(agent.category)}>
                      {agent.api}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{agent.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {agent.description.replace(/"/g, '')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {agent.metrics.interactions.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Interactions</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {agent.metrics.successRate}%
                      </div>
                      <div className="text-xs text-gray-600">Success Rate</div>
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Key Capabilities</h4>
                    <div className="space-y-1">
                      {agent.capabilities.slice(0, 3).map((capability, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {capability}
                        </div>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{agent.capabilities.length - 3} more capabilities
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      asChild
                    >
                      <Link href={`/playground?template=${agent.id}`}>
                        <Play className="w-4 h-4 mr-2" />
                        Try Demo
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Template Details */}
        {selectedTemplate && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                Template Details: {demoAgents.find(a => a.id === selectedTemplate)?.name}
              </CardTitle>
              <CardDescription>
                Detailed breakdown of capabilities and sample interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const agent = demoAgents.find(a => a.id === selectedTemplate)!
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Capabilities */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">All Capabilities</h3>
                      <div className="space-y-2">
                        {agent.capabilities.map((capability, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            <span className="text-gray-700">{capability}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sample Queries */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Sample Queries</h3>
                      <div className="space-y-3">
                        {agent.sampleQueries.map((query, index) => (
                          <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start">
                              <Users className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                              <span className="text-blue-800 text-sm">{query}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        )}

        {/* Business Impact */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Business Impact Metrics
            </CardTitle>
            <CardDescription>
              Real results from companies using these agent templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  $57.9K
                </div>
                <div className="text-sm text-green-700">Total Cost Savings</div>
                <div className="text-xs text-green-600 mt-1">Per month across all templates</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  398h
                </div>
                <div className="text-sm text-blue-700">Time Automated</div>
                <div className="text-xs text-blue-600 mt-1">Human hours saved monthly</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  96.6%
                </div>
                <div className="text-sm text-purple-700">Success Rate</div>
                <div className="text-xs text-purple-600 mt-1">Average across all agents</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  1.1s
                </div>
                <div className="text-sm text-orange-700">Response Time</div>
                <div className="text-xs text-orange-600 mt-1">Average response speed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Choose a template and have your AI agent running in under 5 minutes. 
              No coding required, just configure and deploy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/builder">
                  Start Building
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600" asChild>
                <Link href="/playground">
                  Try Demo First
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}