/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        polar: {
          bg: '#F4F8FA',
          card: '#FFFFFF',
          ink: '#0F172A',
          muted: '#475569',
          action: '#0284C7',
          navy: '#0F2A43',
          border: '#E2E8F0',
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#DC2626',
          softWarning: '#FFEDD5',
          ice: '#DBEAFE',
          frost: '#E0F2FE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scan-line': 'scanLine 1.5s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'beacon': 'beacon 1.5s ease-in-out infinite',
        'move-vehicle': 'moveVehicle 8s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(16px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        scanLine: { '0%, 100%': { top: '8%' }, '50%': { top: '88%' } },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
        beacon: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        moveVehicle: {
          '0%': { offsetDistance: '0%' },
          '100%': { offsetDistance: '100%' },
        },
      },
    },
  },
  plugins: [],
};
