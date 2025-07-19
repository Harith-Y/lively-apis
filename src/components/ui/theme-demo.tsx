'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { ThemeToggle, useTheme } from './theme-toggle'
import { Sun, Moon, Monitor, Palette } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ThemeDemo() {
  const { theme, effectiveTheme, mounted } = useTheme();
  const [systemPref, setSystemPref] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSystemPref(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  }, []);

  if (!mounted) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg" />;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="w-5 h-5" />
          <span>Dark Mode Demo</span>
        </CardTitle>
        <CardDescription>
          Test the dark mode toggle and see how it affects the interface
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Theme Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Theme</div>
            <div className="font-semibold text-lg capitalize flex items-center justify-center space-x-2">
              {theme === 'system' && <Monitor className="w-4 h-4" />}
              {theme === 'light' && <Sun className="w-4 h-4" />}
              {theme === 'dark' && <Moon className="w-4 h-4" />}
              <span>{theme}</span>
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Effective Theme</div>
            <div className="font-semibold text-lg capitalize flex items-center justify-center space-x-2">
              {effectiveTheme === 'light' && <Sun className="w-4 h-4" />}
              {effectiveTheme === 'dark' && <Moon className="w-4 h-4" />}
              <span>{effectiveTheme}</span>
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">System Preference</div>
            <div className="font-semibold text-lg capitalize">
              {systemPref}
            </div>
          </div>
        </div>
        {/* Toggle Variants */}
        <h3 className="text-lg font-semibold">Toggle Variants</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm">Icon only:</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">With label:</span>
            <ThemeToggle showLabel />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Dropdown:</span>
            <ThemeToggle variant="dropdown" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Small:</span>
            <ThemeToggle size="sm" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Large:</span>
            <ThemeToggle size="lg" />
          </div>
        </div>
        {/* Sample UI Elements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sample UI Elements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Button className="w-full">Primary Button</Button>
              <Button variant="outline" className="w-full">Outline Button</Button>
              <Button variant="ghost" className="w-full">Ghost Button</Button>
            </div>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Sample input field"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <option>Sample option 1</option>
                <option>Sample option 2</option>
              </select>
            </div>
          </div>
        </div>
        {/* Color Swatches */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Color Swatches</h3>
          <div className="grid grid-cols-4 gap-2">
            <div className="h-12 bg-background border border-border rounded flex items-center justify-center text-xs">Background</div>
            <div className="h-12 bg-card border border-border rounded flex items-center justify-center text-xs">Card</div>
            <div className="h-12 bg-primary text-primary-foreground rounded flex items-center justify-center text-xs">Primary</div>
            <div className="h-12 bg-secondary text-secondary-foreground rounded flex items-center justify-center text-xs">Secondary</div>
            <div className="h-12 bg-muted text-muted-foreground rounded flex items-center justify-center text-xs">Muted</div>
            <div className="h-12 bg-accent text-accent-foreground rounded flex items-center justify-center text-xs">Accent</div>
            <div className="h-12 bg-destructive text-destructive-foreground rounded flex items-center justify-center text-xs">Destructive</div>
            <div className="h-12 bg-border rounded flex items-center justify-center text-xs">Border</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}