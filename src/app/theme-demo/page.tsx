import { ThemeDemo } from '@/components/ui/theme-demo'

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Dark Mode Implementation Demo
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            This page demonstrates the dark mode toggle functionality. Try switching between themes 
            and notice how the preference is saved and persists across page reloads.
          </p>
        </div>
        
        <ThemeDemo />
        
        <div className="mt-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Features Implemented</h2>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Persistent theme preference in localStorage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>System theme detection (prefers-color-scheme)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No flash of unstyled content (FOUC)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Smooth theme transitions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Multiple toggle variants</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>React hooks for theme state</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Usage Instructions</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Basic Toggle:</strong>
                  <code className="block mt-1 p-2 bg-muted rounded text-xs">
                    {`<ThemeToggle />`}
                  </code>
                </div>
                <div>
                  <strong>With Label:</strong>
                  <code className="block mt-1 p-2 bg-muted rounded text-xs">
                    {`<ThemeToggle showLabel />`}
                  </code>
                </div>
                <div>
                  <strong>Dropdown Variant:</strong>
                  <code className="block mt-1 p-2 bg-muted rounded text-xs">
                    {`<ThemeToggle variant="dropdown" />`}
                  </code>
                </div>
                <div>
                  <strong>Use Theme Hook:</strong>
                  <code className="block mt-1 p-2 bg-muted rounded text-xs">
                    {`const { theme, effectiveTheme, setTheme } = useTheme()`}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}