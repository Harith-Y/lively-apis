// Server-side theme initialization script
// This file should NOT have 'use client' directive

export function initializeThemeScript(): string {
  return `(function(){try{var theme=localStorage.getItem('theme');if(theme==='dark'){document.documentElement.classList.remove('light');document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme','dark');}else{document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');document.documentElement.setAttribute('data-theme','light');}}catch(e){console.error('Theme initialization error:',e);}})();`;
}