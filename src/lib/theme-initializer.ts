// Server-side theme initialization script
// This file should NOT have 'use client' directive

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