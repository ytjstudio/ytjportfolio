/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      colors: {
        ink: { 900: '#05060A', 800: '#0A0B12', 700: '#0F1118', 600: '#161824', 500: '#1E2030' },
        brand: { purple: '#8B5CF6', blue: '#3B82F6', glow: '#A855F7' },
      },
      backgroundImage: {
        'grid-faint': 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'brand-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, rgba(139,92,246,0.18), rgba(59,130,246,0.18))',
      },
      boxShadow: {
        glow: '0 0 40px rgba(139,92,246,0.35)',
        'glow-blue': '0 0 40px rgba(59,130,246,0.3)',
        glass: '0 8px 32px rgba(0,0,0,0.37)',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0) translateX(0)' }, '50%': { transform: 'translateY(-20px) translateX(10px)' } },
        'float-slow': { '0%, 100%': { transform: 'translateY(0) translateX(0)' }, '50%': { transform: 'translateY(30px) translateX(-15px)' } },
        'pulse-glow': { '0%, 100%': { opacity: '0.5' }, '50%': { opacity: '1' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        'float-slow': 'float-slow 12s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
}
