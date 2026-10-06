import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFBF7',
          100: '#FAF6F0',
          200: '#F5EFE6',
          300: '#EBE2D5',
        },
        cream: {
          50: '#FBF8F3',
          100: '#F7F2EA',
          200: '#EFE5D6',
        },
        espresso: {
          800: '#2A211D',
          900: '#1C1512',
          950: '#110D0B',
        },
        champagne: {
          100: '#F5ECE3',
          200: '#EADBCB',
          300: '#DBC3A8',
          400: '#C5A059',
          500: '#B89246',
          600: '#9B7833',
        },
        rose: {
          beige: '#E8DDD3',
          soft: '#F3ECE7',
        },
        taupe: {
          400: '#A39282',
          500: '#8C7A6B',
          600: '#5A4D41',
        }
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.25em',
        ultra: '0.35em',
      },
      animation: {
        'slow-spin': 'spin 30s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(28, 21, 18, 0.07)',
        'luxury-hover': '0 30px 60px -12px rgba(28, 21, 18, 0.12)',
        'glow': '0 0 25px rgba(197, 160, 89, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
