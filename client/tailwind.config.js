/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Dark Backgrounds
        'luxury': {
          DEFAULT: '#000000',
          50: '#0D0D0D',
          100: '#1A1A1A',
          200: '#0A0A0A',
        },
        // Royal Purple - Primary (Luxury, Sophistication)
        'royal': {
          DEFAULT: '#6366F1',
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        // Gold - Accent (Wealth, Premium)
        'gold': {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Emerald - Secondary (Growth, Success)
        'emerald': {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        // Platinum - Neutral (Elegance)
        'platinum': {
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['5.5rem', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.025em', fontWeight: '800' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '700' }],
        'display-sm': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient': 'gradient 15s ease infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-30px) rotate(5deg)' }
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(245, 158, 11, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6), 0 0 80px rgba(245, 158, 11, 0.4)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 60px rgba(99, 102, 241, 0.6)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-luxury': 'linear-gradient(135deg, #6366F1 0%, #F59E0B 50%, #10B981 100%)',
        'gradient-royal': 'linear-gradient(135deg, #4338CA 0%, #6366F1 100%)',
        'gradient-gold': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'mesh-luxury': `
          radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.2) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(245, 158, 11, 0.15) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(16, 185, 129, 0.15) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(99, 102, 241, 0.2) 0px, transparent 50%)
        `,
      },
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(99, 102, 241, 0.25)',
        'luxury-lg': '0 35px 70px -15px rgba(99, 102, 241, 0.3)',
        'gold': '0 20px 40px -10px rgba(245, 158, 11, 0.3)',
        'emerald': '0 20px 40px -10px rgba(16, 185, 129, 0.3)',
        'glow-royal': '0 0 40px rgba(99, 102, 241, 0.5)',
        'glow-gold': '0 0 40px rgba(245, 158, 11, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(99, 102, 241, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
