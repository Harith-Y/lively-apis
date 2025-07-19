'use client'

export type Theme = 'light' | 'dark' | 'system'

export class ThemeManager {
  private static instance: ThemeManager
  private currentTheme: Theme = 'system'
  private listeners: Set<(theme: Theme) => void> = new Set()

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeTheme()
    }
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager()
    }
    return ThemeManager.instance
  }

  private initializeTheme(): void {
    // Get saved preference or default to system
    const savedTheme = localStorage.getItem('theme') as Theme
    this.currentTheme = savedTheme || 'system'
    
    // Apply the theme immediately
    this.applyTheme(this.currentTheme)
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (this.currentTheme === 'system') {
        this.applyTheme('system')
      }
    })
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement
    const body = document.body
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    body.classList.remove('light', 'dark')
    
    let effectiveTheme: 'light' | 'dark'
    
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      effectiveTheme = theme
    }
    
    // Apply theme classes
    root.classList.add(effectiveTheme)
    body.classList.add(effectiveTheme)
    
    // Update data attribute for CSS targeting
    root.setAttribute('data-theme', effectiveTheme)
    
    // Notify listeners
    this.listeners.forEach(listener => listener(this.currentTheme))
  }

  setTheme(theme: Theme): void {
    this.currentTheme = theme
    localStorage.setItem('theme', theme)
    this.applyTheme(theme)
  }

  getTheme(): Theme {
    return this.currentTheme
  }

  getEffectiveTheme(): 'light' | 'dark' {
    if (this.currentTheme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return this.currentTheme
  }

  subscribe(listener: (theme: Theme) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  toggle(): void {
    const effectiveTheme = this.getEffectiveTheme()
    const newTheme = effectiveTheme === 'dark' ? 'light' : 'dark'
    this.setTheme(newTheme)
  }
}

// Prevent theme flashing by applying theme before React hydration
export function initializeThemeScript(): string {
  return `
    (function() {
      try {
        var theme = localStorage.getItem('theme') || 'system';
        var effectiveTheme;
        
        if (theme === 'system') {
          effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
          effectiveTheme = theme;
        }
        
        document.documentElement.classList.add(effectiveTheme);
        document.body.classList.add(effectiveTheme);
        document.documentElement.setAttribute('data-theme', effectiveTheme);
      } catch (e) {
        console.error('Theme initialization error:', e);
      }
    })();
  `
}