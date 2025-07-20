'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Bot, 
  Plus, 
  Trash2, 
  Play, 
  Settings,
  ArrowRight,
  MessageSquare,
  Code,
  GitBranch,
  Zap
} from 'lucide-react'
import { AgentStep, AgentWorkflow } from '@/lib/agent-planner'

interface WorkflowBuilderProps {
  workflow?: AgentWorkflow
  onWorkflowChange?: (workflow: AgentWorkflow) => void
  onTest?: (workflow: AgentWorkflow) => void
}

export function WorkflowBuilder({ workflow, onWorkflowChange, onTest }: WorkflowBuilderProps) {
  const [selectedStep, setSelectedStep] = useState<string | null>(null)

  const defaultWorkflow: AgentWorkflow = {
    id: 'new_workflow',
    name: 'New Agent Workflow',
    description: 'A new agent workflow',
    goal: 'Help users with their requests',
    steps: [
      {
        id: 'greeting',
        type: 'response',
        title: 'Greeting',
        description: 'Welcome the user',
        responseTemplate: 'Hello! How can I help you today?',
        nextSteps: ['input']
      },
      {
        id: 'input',
        type: 'input',
        title: 'Collect Input',
        description: 'Get information from user',
        nextSteps: ['process']
      },
      {
        id: 'process',
        type: 'api_call',
        title: 'Process Request',
        description: 'Handle the user request',
        nextSteps: ['response']
      },
      {
        id: 'response',
        type: 'response',
        title: 'Provide Response',
        description: 'Send response to user',
        responseTemplate: 'Here is the information you requested: {result}',
        nextSteps: []
      }
    ],
    triggers: ['help', 'assist', 'support'],
    responses: {
      greeting: 'Hello! How can I help you today?',
      error: 'I encountered an error. Please try again.',
      success: 'Task completed successfully!'
    }
  }

  const currentWorkflow = workflow || defaultWorkflow

  const addStep = () => {
    const newStep: AgentStep = {
      id: `step_${Date.now()}`,
      type: 'response',
      title: 'New Step',
      description: 'A new workflow step',
      responseTemplate: 'New response',
      nextSteps: []
    }

    const updatedWorkflow = {
      ...currentWorkflow,
      steps: [...currentWorkflow.steps, newStep]
    }

    onWorkflowChange?.(updatedWorkflow)
  }

  const updateStep = (stepId: string, updates: Partial<AgentStep>) => {
    const updatedWorkflow = {
      ...currentWorkflow,
      steps: currentWorkflow.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    }

    onWorkflowChange?.(updatedWorkflow)
  }

  const deleteStep = (stepId: string) => {
    const updatedWorkflow = {
      ...currentWorkflow,
      steps: currentWorkflow.steps.filter(step => step.id !== stepId)
    }

    onWorkflowChange?.(updatedWorkflow)
  }

  const getStepIcon = (type: AgentStep['type']) => {
    switch (type) {
      case 'response':
        return MessageSquare
      case 'api_call':
        return Code
      case 'condition':
        return GitBranch
      case 'input':
        return Bot
      default:
        return Zap
    }
  }

  const getStepColor = (type: AgentStep['type']) => {
    switch (type) {
      case 'response':
        return 'bg-blue-100 border-blue-300 text-blue-800'
      case 'api_call':
        return 'bg-green-100 border-green-300 text-green-800'
      case 'condition':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'input':
        return 'bg-purple-100 border-purple-300 text-purple-800'
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Workflow Canvas */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <GitBranch className="w-5 h-5 mr-2" />
                  Workflow Designer
                </CardTitle>
                <CardDescription>
                  Drag and drop to build your agent workflow
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={addStep}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => onTest?.(currentWorkflow)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Test
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {currentWorkflow.steps.map((step, index) => {
                const StepIcon = getStepIcon(step.type)
                const isSelected = selectedStep === step.id
                
                return (
                  <div key={step.id} className="relative">
                    {/* Connection line to next step */}
                    {index < currentWorkflow.steps.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-300 z-0"></div>
                    )}
                    
                    {/* Step card */}
                    <div
                      className={`relative z-10 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-purple-500 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      } ${getStepColor(step.type)}`}
                      onClick={() => setSelectedStep(step.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <StepIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-medium">{step.title}</h4>
                            <p className="text-sm opacity-75">{step.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteStep(step.id)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Step details preview */}
                      {step.type === 'response' && step.responseTemplate && (
                        <div className="mt-3 p-2 bg-white/50 rounded text-xs">
                          <strong>Response:</strong> {step.responseTemplate}
                        </div>
                      )}
                      
                      {step.type === 'api_call' && step.endpoint && (
                        <div className="mt-3 p-2 bg-white/50 rounded text-xs">
                          <strong>API:</strong> {step.endpoint.method} {step.endpoint.path}
                        </div>
                      )}

                      {/* Render AI/LLM fields if present */}
                      {(step.endpoint || step.method || step.input || step.output || step.intent) && (
                        <div className="mt-3 p-2 bg-white/50 rounded text-xs space-y-1">
                          {step.endpoint && (
                            <div><strong>Endpoint:</strong> {typeof step.endpoint === 'string' ? step.endpoint : step.endpoint.path || step.endpoint.url || JSON.stringify(step.endpoint)}</div>
                          )}
                          {step.method && (
                            <div><strong>Method:</strong> {step.method}</div>
                          )}
                          {step.input && (
                            <div><strong>Input:</strong> <pre className="inline whitespace-pre-wrap">{JSON.stringify(step.input, null, 2)}</pre></div>
                          )}
                          {step.output && (
                            <div><strong>Output:</strong> <pre className="inline whitespace-pre-wrap">{JSON.stringify(step.output, null, 2)}</pre></div>
                          )}
                          {step.intent && (
                            <div><strong>Intent:</strong> {step.intent}</div>
                          )}
                        </div>
                      )}

                      {/* Arrow to next step */}
                      {step.nextSteps && step.nextSteps.length > 0 && index < currentWorkflow.steps.length - 1 && (
                        <div className="flex justify-center py-2">
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              
              {/* Add step button */}
              <div className="flex justify-center py-4">
                <Button
                  variant="outline"
                  onClick={addStep}
                  className="border-dashed border-2 border-gray-300 hover:border-purple-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Step Editor */}
      <div className="space-y-6">
        {selectedStep ? (
          <StepEditor
            step={currentWorkflow.steps.find(s => s.id === selectedStep)!}
            onUpdate={(updates) => updateStep(selectedStep, updates)}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Workflow Properties</CardTitle>
              <CardDescription>
                Configure your agent workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Name
                </label>
                <Input
                  value={currentWorkflow.name}
                  onChange={(e) => onWorkflowChange?.({
                    ...currentWorkflow,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={currentWorkflow.description}
                  onChange={(e) => onWorkflowChange?.({
                    ...currentWorkflow,
                    description: e.target.value
                  })}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal
                </label>
                <Textarea
                  value={currentWorkflow.goal}
                  onChange={(e) => onWorkflowChange?.({
                    ...currentWorkflow,
                    goal: e.target.value
                  })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step Types Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Step Types</CardTitle>
            <CardDescription>
              Drag these onto the canvas to add new steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { type: 'response' as const, title: 'Response', description: 'Send message to user' },
              { type: 'api_call' as const, title: 'API Call', description: 'Call external API' },
              { type: 'condition' as const, title: 'Condition', description: 'Branch based on logic' },
              { type: 'input' as const, title: 'Input', description: 'Collect user input' }
            ].map((stepType) => {
              const StepIcon = getStepIcon(stepType.type)
              return (
                <div
                  key={stepType.type}
                  className={`p-3 border rounded-lg cursor-grab hover:shadow-md transition-shadow ${getStepColor(stepType.type)}`}
                  draggable
                >
                  <div className="flex items-center space-x-3">
                    <StepIcon className="w-4 h-4" />
                    <div>
                      <div className="font-medium text-sm">{stepType.title}</div>
                      <div className="text-xs opacity-75">{stepType.description}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface StepEditorProps {
  step: AgentStep
  onUpdate: (updates: Partial<AgentStep>) => void
}

function StepEditor({ step, onUpdate }: StepEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Edit Step
        </CardTitle>
        <CardDescription>
          Configure the selected workflow step
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Step Title
          </label>
          <Input
            value={step.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Textarea
            value={step.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Step Type
          </label>
          <select
            value={step.type}
            onChange={(e) => onUpdate({ type: e.target.value as AgentStep['type'] })}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="response">Response</option>
            <option value="api_call">API Call</option>
            <option value="condition">Condition</option>
            <option value="input">Input</option>
          </select>
        </div>

        {step.type === 'response' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response Template
            </label>
            <Textarea
              value={step.responseTemplate || ''}
              onChange={(e) => onUpdate({ responseTemplate: e.target.value })}
              rows={3}
              placeholder="Enter the response message template..."
            />
          </div>
        )}

        {step.type === 'condition' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition
            </label>
            <Input
              value={step.condition || ''}
              onChange={(e) => onUpdate({ condition: e.target.value })}
              placeholder="Enter condition logic..."
            />
          </div>
        )}

        {step.type === 'api_call' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Endpoint
              </label>
              <Input
                value={step.endpoint?.path || ''}
                onChange={(e) => onUpdate({ 
                  endpoint: { ...step.endpoint!, path: e.target.value }
                })}
                placeholder="/api/endpoint"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTTP Method
              </label>
              <select
                value={step.endpoint?.method || 'GET'}
                onChange={(e) => onUpdate({ 
                  endpoint: { ...step.endpoint!, method: e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' }
                })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}