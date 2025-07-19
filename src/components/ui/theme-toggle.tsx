'use client'

import { useState, useEffect } from 'react'
import { Button } from './button'
import { Sun, Moon, Monitor } from 'lucide-react'
import { ThemeManager, Theme } from '@/lib/theme'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ 
  variant = 'button', 
  size = 'md', 
  className,
  showLabel = false 
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const themeManager = ThemeManager.getInstance()
    setTheme(themeManager.getTheme())

    const unsubscribe = themeManager.subscribe((newTheme) => {
      setTheme(newTheme)
    })

    return unsubscribe
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'icon'}
        className={cn('relative', className)}
        disabled
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const themeManager = ThemeManager.getInstance()

  if (variant === 'dropdown') {
    return <ThemeDropdown theme={theme} onThemeChange={themeManager.setTheme.bind(themeManager)} />
  }

  const handleToggle = () => {
    themeManager.toggle()
  }

  const getIcon = () => {
    const effectiveTheme = themeManager.getEffectiveTheme()
    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
    
    if (theme === 'system') {
      return <Monitor className={iconSize} />
    }
    
    return effectiveTheme === 'dark' ? 
      <Moon className={iconSize} /> : 
      <Sun className={iconSize} />
  }

  const getLabel = () => {
    if (theme === 'system') return 'System'
    return theme === 'dark' ? 'Dark' : 'Light'
  }

  return (
    <Button
      variant="ghost"
      size={showLabel ? (size === 'sm' ? 'sm' : 'default') : (size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'icon')}
      onClick={handleToggle}
      className={cn(
        'relative transition-all duration-200 hover:bg-accent',
        className
      )}
      title={`Switch to ${themeManager.getEffectiveTheme() === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="flex items-center space-x-2">
        {getIcon()}
        {showLabel && <span className="text-sm">{getLabel()}</span>}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

interface ThemeDropdownProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

function ThemeDropdown({ theme, onThemeChange }: ThemeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
  ]

  const currentTheme = themes.find(t => t.value === theme)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        {currentTheme?.icon}
        <span className="text-sm">{currentTheme?.label}</span>
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  onThemeChange(themeOption.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                  theme === themeOption.value && 'bg-gray-100 dark:bg-gray-700'
                )}
              >
                {themeOption.icon}
                <span>{themeOption.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Hook for using theme in components
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const themeManager = ThemeManager.getInstance()
    setTheme(themeManager.getTheme())

    const unsubscribe = themeManager.subscribe((newTheme) => {
      setTheme(newTheme)
    })

    return unsubscribe
  }, [])

  const themeManager = ThemeManager.getInstance()

  return {
    theme,
    effectiveTheme: mounted ? themeManager.getEffectiveTheme() : 'light',
    setTheme: themeManager.setTheme.bind(themeManager),
    toggle: themeManager.toggle.bind(themeManager),
    mounted
  }
}