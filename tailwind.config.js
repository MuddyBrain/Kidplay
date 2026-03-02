/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF8C66',
        'primary-light': '#FFAB91',
        'primary-dark': '#E57358',
        'primary-soft': '#FFF2EE',
        background: '#FFFBF0',
        'background-warm': '#FFF8F0',
        'background-gradient-start': '#FFFBF0',
        'background-gradient-end': '#FFF5E6',
        text: '#4A4A4A',
        'text-light': '#6B6B6B',
        'text-lighter': '#9E9E9E',
        accent: '#4ECDC4',
        'accent-light': '#80CBC4',
        'accent-dark': '#26A69A',
        danger: '#FF6B6B',
        'danger-light': '#FF8A8A',
        'danger-soft': '#FFEBEB',
        success: '#66BB6A',
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 20px -4px rgba(0, 0, 0, 0.1)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
        'glow-primary': '0 0 30px rgba(255, 140, 102, 0.4)',
        'glow-accent': '0 0 30px rgba(78, 205, 196, 0.4)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #FF8C66 0%, #FFAB91 100%)',
        'gradient-accent': 'linear-gradient(135deg, #4ECDC4 0%, #80CBC4 100%)',
        'gradient-warm': 'linear-gradient(180deg, #FFFBF0 0%, #FFF5E6 100%)',
        'gradient-card': 'linear-gradient(135deg, #FFFFFF 0%, #FFFBF0 100%)',
        'gradient-hero': 'linear-gradient(135deg, #FFFBF0 0%, #FFF2EE 50%, #FFF5E6 100%)',
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 0.6s ease-in-out infinite',
        'shake': 'shake 0.3s ease-in-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'celebrate': 'celebrate 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 4px 20px rgba(255, 140, 102, 0.3)' },
          '50%': { boxShadow: '0 4px 40px rgba(255, 140, 102, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'celebrate': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}
