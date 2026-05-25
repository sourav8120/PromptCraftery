/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#0a0a0f',
          soft: '#1a1a2e',
          muted: '#2d2d4e',
        },
        glow: {
          DEFAULT: '#7c3aed',
          soft: '#a855f7',
          bright: '#c084fc',
          dim: '#4c1d95',
        },
        amber: {
          glow: '#f59e0b',
        },
        surface: {
          DEFAULT: '#0f0f1a',
          raised: '#161625',
          high: '#1e1e30',
          border: 'rgba(124,58,237,0.2)',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(265,100%,20%,0.4) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(290,80%,15%,0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(250,100%,12%,0.5) 0px, transparent 50%)',
        'card-gradient': 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(168,85,247,0.04) 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.15) 50%, transparent 100%)',
      }
    },
  },
  plugins: [],
}
