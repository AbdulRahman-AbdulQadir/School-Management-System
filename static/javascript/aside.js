// static/javascript/aside.js
// Make app() available globally for Alpine's x-data="app()"
window.app = function () {
  return {
    theme: 'light',
    mobileOpen: false,
    year: new Date().getFullYear(),

    init() {
      const saved = localStorage.getItem('theme');
      if (saved) this.theme = saved;
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.theme = 'dark';
      }

      // sync document root for Tailwind class dark mode
      document.documentElement.classList.toggle('dark', this.theme === 'dark');
    },

    toggleTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', this.theme);
      document.documentElement.classList.toggle('dark', this.theme === 'dark');
    },

    // other shared helpers
    dismissMessage(id) {
      const el = document.getElementById(id);
      if (el) el.remove();
    }
  };
};
