import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'iphone14': { raw: '(max-width: 430px) and (max-height: 932px)' },
      'lg': '1024px',
      'xl': '1280px',
      'macair': { raw: '(min-width: 1280px) and (max-width: 1600px) and (min-resolution: 2dppx)' },
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#007AFF',
          hover: '#0071EB',
          light: '#409CFF',
          subtle: 'rgba(0, 122, 255, 0.08)',
        },
        surface: {
          primary: 'rgba(255, 255, 255, 0.72)',
          secondary: 'rgba(255, 255, 255, 0.48)',
          tertiary: 'rgba(255, 255, 255, 0.32)',
          'primary-dark': 'rgba(30, 30, 30, 0.72)',
          'secondary-dark': 'rgba(44, 44, 46, 0.64)',
          'tertiary-dark': 'rgba(58, 58, 60, 0.48)',
        },
        border: {
          light: 'rgba(0, 0, 0, 0.06)',
          DEFAULT: 'rgba(0, 0, 0, 0.1)',
          dark: 'rgba(255, 255, 255, 0.08)',
          'dark-light': 'rgba(255, 255, 255, 0.12)',
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.05)',
        'glass-lg': '0 8px 40px rgba(0, 0, 0, 0.08)',
        'glass-dark': '0 4px 30px rgba(0, 0, 0, 0.3)',
        'glass-lg-dark': '0 8px 40px rgba(0, 0, 0, 0.4)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 2px 8px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 1px 3px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: {
        glass: '20px',
        'glass-lg': '40px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
