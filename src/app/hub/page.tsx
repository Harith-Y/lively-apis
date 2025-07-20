'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

interface Template {
  id: string
  name: string
  description?: string
  created_at?: string
  configuration?: {
    workflow?: {
      steps?: Array<{ name?: string; type?: string; [key: string]: unknown }>
    }
  }
  [key: string]: unknown
}

export default function AgentHubPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState<Template[]>([])
  const [preview, setPreview] = useState<Template | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [composePreview, setComposePreview] = useState<Template | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/templates`)
      .then(res => res.json())
      .then(data => setTemplates(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!search.trim()) setFiltered(templates)
    else setFiltered(templates.filter(t =>
      (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase())
    ))
  }, [search, templates])

  // Import to builder
  const handleImport = (tpl: Template | null) => {
    if (!tpl) return
    localStorage.setItem('refine-agent', JSON.stringify(tpl))
    router.push('/builder?refine=1')
  }

  // Clone/fork (for now, just import as new)
  const handleClone = (tpl: Template | null) => {
    if (!tpl) return
    const fork = { ...tpl, id: undefined, name: tpl.name + ' (Copy)' }
    localStorage.setItem('refine-agent', JSON.stringify(fork))
    router.push('/builder?refine=1')
  }

  // Multi-select logic
  const toggleSelect = (id: string) => {
    setSelectedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id])
  }
  const handleCompose = () => {
    const selected = filtered.filter(t => selectedIds.includes(t.id))
    if (selected.length < 2) return
    // Merge workflows
    const composedWorkflow = {
      steps: selected.flatMap(t => t.configuration?.workflow?.steps || [])
    }
    setComposePreview({
      id: 'composed-' + Date.now(),
      name: 'Composed Agent',
      description: 'Composed from: ' + selected.map(t => t.name).join(', '),
      configuration: { workflow: composedWorkflow }
    })
  }
  const handleImportComposed = () => {
    if (composePreview) {
      localStorage.setItem('refine-agent', JSON.stringify(composePreview))
      router.push('/builder?refine=1')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Agent Hub</h1>
        <p className="text-gray-600 mb-6">Browse, search, and compose reusable agents and templates.</p>
        <Input
          className="mb-6"
          placeholder="Search agents or templates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {loading ? (
          <div>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-gray-500">No agents or templates found.</div>
        ) : (
          <>
            <div className="mb-4 flex items-center space-x-2">
              <Button
                onClick={handleCompose}
                disabled={selectedIds.length < 2}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Compose Selected ({selectedIds.length})
              </Button>
              {selectedIds.length > 0 && (
                <Button variant="outline" onClick={() => setSelectedIds([])}>Clear Selection</Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map(tpl => (
                <Card key={tpl.id} className={`cursor-pointer hover:shadow-lg transition border-2 ${selectedIds.includes(tpl.id) ? 'border-purple-600' : 'border-transparent'}`}
                  onClick={e => {
                    // Only toggle select if not clicking preview
                    if ((e.target as HTMLElement).closest('button')) return
                    toggleSelect(tpl.id)
                  }}
                >
                  <CardHeader>
                    <CardTitle>{tpl.name}</CardTitle>
                    <CardDescription>{tpl.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">Created: {tpl.created_at ? new Date(tpl.created_at).toLocaleDateString() : 'N/A'}</div>
                      <Button size="sm" variant="outline" onClick={() => setPreview(tpl)}>Preview</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
        <Dialog open={!!preview} onOpenChange={v => !v && setPreview(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{preview?.name}</DialogTitle>
            </DialogHeader>
            <div className="mb-2 text-gray-700">{preview?.description}</div>
            {preview?.configuration && preview?.configuration.workflow && preview?.configuration.workflow.steps && (
              <ul className="list-disc ml-5 text-xs text-gray-700 mb-2">
                {preview.configuration.workflow.steps.map((step, i: number) => (
                  <li key={i}>{step.name || step.type || `Step ${i+1}`}</li>
                ))}
              </ul>
            )}
            <DialogFooter>
              <Button onClick={() => handleImport(preview)} className="w-full">Import to Builder</Button>
              <Button variant="outline" onClick={() => handleClone(preview)} className="w-full">Clone/Fork</Button>
              <Button variant="outline" onClick={() => setPreview(null)} className="w-full">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={!!composePreview} onOpenChange={v => !v && setComposePreview(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{composePreview?.name}</DialogTitle>
            </DialogHeader>
            <div className="mb-2 text-gray-700">{composePreview?.description}</div>
            {composePreview?.configuration && composePreview?.configuration.workflow && composePreview?.configuration.workflow.steps && (
              <ul className="list-disc ml-5 text-xs text-gray-700 mb-2">
                {composePreview.configuration.workflow.steps.map((step, i: number) => (
                  <li key={i}>{step.name || step.type || `Step ${i+1}`}</li>
                ))}
              </ul>
            )}
            <DialogFooter>
              <Button onClick={handleImportComposed} className="w-full">Import Composed Agent</Button>
              <Button variant="outline" onClick={() => setComposePreview(null)} className="w-full">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 