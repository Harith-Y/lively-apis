'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Bot, 
  Plus, 
  Activity, 
  Users, 
  MessageSquare, 
  TrendingUp,
  MoreHorizontal,
  Play,
  Pause,
  Settings
} from 'lucide-react'
import Link from 'next/link'

// Mock data for demonstration
const agents = [
  {
    id: '1',
    name: 'Customer Support Bot',
    description: 'Handles customer inquiries and support tickets',
    status: 'active',
    interactions: 1247,
    successRate: 94.2,
    lastActive: '2 minutes ago'
  },
  {
    id: '2',
    name: 'Sales Assistant',
    description: 'Qualifies leads and schedules meetings',
    status: 'active',
    interactions: 856,
    successRate: 89.7,
    lastActive: '5 minutes ago'
  },
  {
    id: '3',
    name: 'Order Tracker',
    description: 'Provides order status and shipping updates',
    status: 'inactive',
    interactions: 432,
    successRate: 96.1,
    lastActive: '2 hours ago'
  }
]

const stats = [
  {
    title: 'Total Agents',
    value: '12',
    change: '+2 this month',
    icon: Bot,
    color: 'text-blue-600'
  },
  {
    title: 'Total Interactions',
    value: '24,847',
    change: '+12% from last month',
    icon: MessageSquare,
    color: 'text-green-600'
  },
  {
    title: 'Success Rate',
    value: '92.4%',
    change: '+2.1% from last month',
    icon: TrendingUp,
    color: 'text-purple-600'
  },
  {
    title: 'Active Users',
    value: '1,429',
    change: '+8% from last month',
    icon: Users,
    color: 'text-orange-600'
  }
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your AI agents</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Link href="/builder">
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-600">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Agents Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agents List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Agents</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/builder">
                      <Plus className="w-4 h-4 mr-2" />
                      New Agent
                    </Link>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage and monitor your AI agents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                        <p className="text-sm text-gray-600">{agent.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            agent.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {agent.status === 'active' ? (
                              <Activity className="w-3 h-3 mr-1" />
                            ) : (
                              <Pause className="w-3 h-3 mr-1" />
                            )}
                            {agent.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {agent.interactions} interactions
                          </span>
                          <span className="text-xs text-gray-500">
                            {agent.successRate}% success
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/playground?agent=${agent.id}`}>
                          <Play className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/builder">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Agent
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/playground">
                    <Play className="w-4 h-4 mr-2" />
                    Test Agent
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  API Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-900">Customer Support Bot</span>
                    <span className="text-gray-500">2m ago</span>
                  </div>
                  <p className="text-gray-600">Handled 12 new inquiries</p>
                </div>
                <div className="text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-900">Sales Assistant</span>
                    <span className="text-gray-500">5m ago</span>
                  </div>
                  <p className="text-gray-600">Qualified 3 new leads</p>
                </div>
                <div className="text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-900">Order Tracker</span>
                    <span className="text-gray-500">1h ago</span>
                  </div>
                  <p className="text-gray-600">Updated 45 order statuses</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}