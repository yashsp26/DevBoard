/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        foreground: 'var(--color-foreground)',
        'muted-foreground': 'var(--color-muted-foreground)',
        border: 'var(--color-border)',
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        accent: 'var(--color-primary)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        success: 'var(--color-success)',
        info: 'var(--color-info)',
      },
    },
  },
}
