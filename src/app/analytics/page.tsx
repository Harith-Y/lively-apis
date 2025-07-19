'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Chart } from '@/components/ui/chart'
import { 
  DollarSign, 
  CheckCircle,
  Calendar,
  Download,
  Target,
  Zap
} from 'lucide-react'
import { businessMetrics, usageAnalytics, demoAgents } from '@/lib/demo-data'

export default function AnalyticsPage() {
  const roiCalculation = {
    monthlyAgentCost: 299,
    humanEquivalentCost: 4200,
    monthlySavings: 3901,
    annualSavings: 46812,
    paybackPeriod: 0.8, // months
    roi: 1567 // percentage
  }

  const chartData = {
    interactions: usageAnalytics.dailyInteractions.map(day => ({
      name: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: day.interactions,
      success: day.success
    })),
    responseTime: usageAnalytics.responseTimeDistribution.map(item => ({
      name: item.range,
      value: item.count
    })),
    savings: [
      { name: 'Oct', value: 12400 },
      { name: 'Nov', value: 18600 },
      { name: 'Dec', value: 24800 },
      { name: 'Jan', value: 31200 }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Impact Dashboard</h1>
            <p className="text-gray-600">Track ROI, cost savings, and automation metrics</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Last 7 days
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Total Cost Savings
              </CardTitle>
              <DollarSign className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                ${businessMetrics.totalCostSavings.toLocaleString()}
              </div>
              <p className="text-xs text-green-700 mt-1">
                +{businessMetrics.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                Time Automated
              </CardTitle>
              <Zap className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {businessMetrics.totalTimeAutomated}h
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Human hours saved this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">
                Success Rate
              </CardTitle>
              <Target className="w-4 h-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {businessMetrics.averageSuccessRate}%
              </div>
              <p className="text-xs text-purple-700 mt-1">
                Across {businessMetrics.totalInteractions.toLocaleString()} interactions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">
                Efficiency Score
              </CardTitle>
              <Zap className="w-4 h-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">
                {businessMetrics.automationEfficiency}%
              </div>
              <p className="text-xs text-orange-700 mt-1">
                Automation efficiency rating
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="agents">Agent Metrics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Interactions</CardTitle>
                  <CardDescription>
                    Agent interactions and success rates over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart 
                    data={chartData.interactions}
                    type="line"
                    dataKey="value"
                    xAxisKey="name"
                    color="#8b5cf6"
                    height={250}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Savings Trend</CardTitle>
                  <CardDescription>
                    Monthly cost savings from automation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart 
                    data={chartData.savings}
                    type="bar"
                    dataKey="value"
                    xAxisKey="name"
                    color="#10b981"
                    height={250}
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Distribution</CardTitle>
                <CardDescription>
                  How quickly your agents respond to user queries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Chart 
                  data={chartData.responseTime}
                  type="bar"
                  dataKey="value"
                  xAxisKey="name"
                  color="#3b82f6"
                  height={200}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ROI Analysis Tab */}
          <TabsContent value="roi" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>ROI Calculator</CardTitle>
                  <CardDescription>
                    Return on investment analysis for your AI agents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Monthly Agent Cost</span>
                    <span className="font-semibold">${roiCalculation.monthlyAgentCost}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Human Equivalent Cost</span>
                    <span className="font-semibold">${roiCalculation.humanEquivalentCost}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-green-700 font-medium">Monthly Savings</span>
                    <span className="font-bold text-green-800">${roiCalculation.monthlySavings}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-blue-700 font-medium">Annual Savings</span>
                    <span className="font-bold text-blue-800">${roiCalculation.annualSavings}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Returns</CardTitle>
                  <CardDescription>
                    Key financial metrics and projections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {roiCalculation.roi}%
                    </div>
                    <div className="text-sm text-green-700">Return on Investment</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {roiCalculation.paybackPeriod}
                    </div>
                    <div className="text-sm text-blue-700">Months to Payback</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>Break-even achieved in under 1 month</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>15x return on investment annually</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      <span>Scales with business growth</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Endpoints</CardTitle>
                  <CardDescription>
                    Most frequently used API endpoints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {usageAnalytics.topEndpoints.slice(0, 5).map((endpoint, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{endpoint.endpoint}</div>
                          <div className="text-xs text-gray-600">
                            {endpoint.success}/{endpoint.calls} successful
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{endpoint.calls}</div>
                          <div className="text-xs text-green-600">
                            {((endpoint.success / endpoint.calls) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Key performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {businessMetrics.averageResponseTime}s
                    </div>
                    <div className="text-sm text-blue-700">Avg Response Time</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {businessMetrics.customerSatisfaction}/5
                    </div>
                    <div className="text-sm text-green-700">Customer Rating</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      99.2%
                    </div>
                    <div className="text-sm text-purple-700">Uptime</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Error Analysis</CardTitle>
                  <CardDescription>
                    Common issues and resolutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="font-medium text-red-800 text-sm">API Rate Limits</div>
                      <div className="text-xs text-red-600">2.1% of failures</div>
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="font-medium text-yellow-800 text-sm">Timeout Errors</div>
                      <div className="text-xs text-yellow-600">1.3% of failures</div>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="font-medium text-orange-800 text-sm">Invalid Parameters</div>
                      <div className="text-xs text-orange-600">0.8% of failures</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Agent Metrics Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {demoAgents.map((agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription>{agent.api} Integration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {agent.metrics.interactions.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600">Interactions</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            {agent.metrics.successRate}%
                          </div>
                          <div className="text-xs text-gray-600">Success</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Response Time</span>
                          <span className="font-medium">{agent.metrics.avgResponseTime}s</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Cost Savings</span>
                          <span className="font-medium text-green-600">
                            ${agent.metrics.costSavings.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Time Saved</span>
                          <span className="font-medium text-blue-600">
                            {agent.metrics.timeAutomated}h
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}