/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F4FF',
          100: '#E5EDFF',
          200: '#CCDCFF',
          300: '#99BDFF',
          400: '#668EFF',
          500: '#3366FF', // Main primary color
          600: '#2952CC',
          700: '#1F3D99',
          800: '#142966',
          900: '#0A1433',
        },
        secondary: {
          50: '#EDFCFA',
          100: '#D3F9F5',
          200: '#A8F3EB',
          300: '#7DEAE0',
          400: '#52DFD1',
          500: '#14B8A6', // Main secondary color
          600: '#0F9384',
          700: '#0B6E63',
          800: '#074A42',
          900: '#032521',
        },
        accent: {
          50: '#FFF5F5',
          100: '#FED7D7',
          200: '#FEB2B2',
          300: '#FC8181',
          400: '#F56565',
          500: '#E53E3E', // Main accent color
          600: '#C53030',
          700: '#9B2C2C',
          800: '#822727',
          900: '#63171B',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
};