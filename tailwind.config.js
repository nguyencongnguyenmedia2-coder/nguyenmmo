/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#050507',
          900: '#08080B',
          850: '#0D0D12',
          800: '#14141E',
          750: '#1A1A28',
          700: '#222234',
        },
        neon: {
          red: '#FF1E42',
          'red-hover': '#E01435',
          'red-glow': 'rgba(255, 30, 66, 0.4)',
        },
        gold: {
          400: '#FBBF24',
          500: '#FFD700',
          600: '#D97706',
          glow: 'rgba(255, 215, 0, 0.35)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-red': '0 0 25px rgba(255, 30, 66, 0.35)',
        'neon-gold': '0 0 25px rgba(255, 215, 0, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glow-red-radial': 'radial-gradient(circle at center, rgba(255, 30, 66, 0.15) 0%, transparent 70%)',
      },
      borderRadius: {
        'pill': '40px',
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow-shine': 'shine 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};
