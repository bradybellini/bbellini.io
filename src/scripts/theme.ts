type Theme = 'light' | 'dark' | 'system';

class ThemeManager {
  private currentTheme: Theme = 'system';
  
  constructor() {
    this.init();
  }
  
  private init() {
    // Check for saved theme preference or default to 'system'
    const savedTheme = localStorage.getItem('theme') as Theme || 'system';
    this.setTheme(savedTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.currentTheme === 'system') {
        this.applyTheme();
      }
    });
  }
  
  private applyTheme() {
    const root = document.documentElement;
    
    if (this.currentTheme === 'system') {
      // Remove manual theme attributes to use system preference
      root.removeAttribute('data-theme');
    } else {
      // Set manual theme
      root.setAttribute('data-theme', this.currentTheme);
    }
  }
  
  setTheme(theme: Theme) {
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme();
  }
  
  getTheme(): Theme {
    return this.currentTheme;
  }
  
  getSystemTheme(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  getCurrentEffectiveTheme(): 'light' | 'dark' {
    return this.currentTheme === 'system' ? this.getSystemTheme() : this.currentTheme;
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export for use in components
export { themeManager, type Theme };
