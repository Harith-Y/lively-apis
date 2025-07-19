'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ShoppingCart, 
  CreditCard, 
  MessageSquare, 
  Play, 
  Copy,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const TEMPLATES_API = BACKEND_BASE_URL + '/api/templates';

interface Template {
  id: string;
  name: string;
  description: string;
  api_source: string;
  capabilities: string[];
  sample_queries: string[];
  category?: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [usedTemplate, setUsedTemplate] = useState<Template | null>(null)

  useEffect(() => {
    async function fetchTemplates() {
      const res = await fetch(TEMPLATES_API)
      const data = await res.json()
      setTemplates(data)
    }
    fetchTemplates()
  }, [])

  const getIcon = (category: string) => {
    switch (category) {
      case 'ecommerce':
        return ShoppingCart
      case 'payments':
        return CreditCard
      case 'communication':
        return MessageSquare
      case 'analytics':
        return TrendingUp
      default:
        return Sparkles // Default icon
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
          {templates.map((template) => {
            const Icon = getIcon(template.category || '')
            const isSelected = selectedTemplate === template.id

            return (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-purple-500 shadow-lg' : ''
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      {Icon && <Icon className="w-6 h-6 text-white" />}
                    </div>
                    {/* Removed API source/URL badge */}
                  </div>
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Capabilities */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Key Capabilities</h4>
                    <div className="space-y-1">
                      {template.capabilities?.slice(0, 3).map((capability, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {capability}
                        </div>
                      ))}
                      {template.capabilities?.length > 3 && (
                        <div className="text-sm text-gray-500">
                          +{template.capabilities.length - 3} more capabilities
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
                      <Link href={`/playground?template=${template.id}`}>
                        <Play className="w-4 h-4 mr-2" />
                        Try Demo
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setUsedTemplate(template)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl mt-12 p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-8 text-lg md:text-xl max-w-2xl mx-auto">
            Choose a template and have your AI agent running in under 5 minutes. No coding required, just configure and deploy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/builder"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-100 transition"
            >
              Start Building
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
            <a
              href="/playground"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-100 transition"
            >
              Try Demo First
            </a>
          </div>
        </div>
      </div>
      {/* Used Template Panel */}
      {usedTemplate && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none"
              onClick={() => setUsedTemplate(null)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-1">
              Template Details: {usedTemplate.name}
            </h2>
            <p className="text-gray-500 mb-6">
              Detailed breakdown of capabilities and sample interactions
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Capabilities */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">All Capabilities</h3>
                <div className="space-y-3">
                  {usedTemplate.capabilities?.map((cap: string, i: number) => (
                    <div key={i} className="flex items-center bg-gray-50 rounded-lg px-4 py-3 text-lg">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                      {cap}
                    </div>
                  ))}
                </div>
              </div>
              {/* Sample Queries */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Sample Queries</h3>
                <div className="space-y-3">
                  {usedTemplate.sample_queries?.map((q: string, i: number) => (
                    <div key={i} className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-lg text-blue-800">
                      <Users className="w-5 h-5 text-blue-600 mr-3" />
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}