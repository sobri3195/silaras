import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f4f7fb',
        foreground: '#0f172a',
        primary: {
          DEFAULT: '#102a56',
          light: '#1e3a70',
        },
        secondary: '#3b5f8f',
        accent: '#06b6d4',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 10px 35px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config;
