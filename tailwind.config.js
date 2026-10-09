/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        nivesh: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        surface: {
          light: '#F8FAFC',
          card: '#FFFFFF',
          ivory: '#F9FAFB',
          subtle: '#F1F5F9',
          border: '#E2E8F0',
          borderLight: '#F1F5F9',
        },
        finance: {
          profit: '#16A34A',
          profitBg: '#F0FDF4',
          profitBorder: '#BBF7D0',
          loss: '#E11D48',
          lossBg: '#FFF1F2',
          lossBorder: '#FECDD3',
          warn: '#EA580C',
          warnBg: '#FFF7ED',
          warnBorder: '#FED7AA',
          info: '#2563EB',
          infoBg: '#EFF6FF',
          infoBorder: '#BFDBFE',
        }
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'elevated': '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -4px rgba(0, 0, 0, 0.02)',
        'glow': '0 0 15px -3px rgba(13, 148, 136, 0.15)',
      }
    },
  },
  plugins: [],
}
