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
    if (typeof window === 'undefined') return;
    // Get saved preference or default to system
    const savedTheme = localStorage.getItem('theme') as Theme;
    this.currentTheme = savedTheme || 'system';
    // Apply the theme immediately
    this.applyTheme(this.currentTheme);
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.currentTheme === 'system') {
        this.applyTheme('system');
      }
    });
  }

  private applyTheme(theme: Theme): void {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    let effectiveTheme: 'light' | 'dark';
    if (theme === 'dark') {
      effectiveTheme = 'dark';
    } else {
      effectiveTheme = 'light';
    }
    // Apply theme classes
    root.classList.add(effectiveTheme);
    body.classList.add(effectiveTheme);
    // Update data attribute for CSS targeting
    root.setAttribute('data-theme', effectiveTheme);
    // Debug: log the classes
    console.log('Theme classes after ThemeManager:', root.className);
    // Notify listeners
    this.listeners.forEach(listener => listener(this.currentTheme));
  }

  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.removeItem('theme');
      }
      this.applyTheme(theme);
    }
  }

  getTheme(): Theme {
    return this.currentTheme
  }

  getEffectiveTheme(): 'light' | 'dark' {
    if (typeof window === 'undefined') return 'light';
    if (this.currentTheme === 'dark') {
      return 'dark';
    }
    return 'light';
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

export function initializeThemeScript(): string {
  return `(function(){try{var theme=localStorage.getItem('theme')||'system';var effectiveTheme;if(theme==='system'){effectiveTheme=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}else{effectiveTheme=theme;}if(document.documentElement){document.documentElement.classList.add(effectiveTheme);document.documentElement.setAttribute('data-theme',effectiveTheme);}if(document.body){document.body.classList.add(effectiveTheme);}}catch(e){console.error('Theme initialization error:',e);}})();`;
}
