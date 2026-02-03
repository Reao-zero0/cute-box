/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chic: {
          bg: '#0F0518',
          glass: 'rgba(255, 255, 255, 0.1)',
          glassBorder: 'rgba(255, 255, 255, 0.2)',
          primary: '#D946EF',
          secondary: '#8B5CF6',
          accent: '#06B6D4',
          text: '#FFFFFF',
          muted: '#E9D5FF',
        }
      },
      fontFamily: {
        display: ['Marhey', 'cursive'],
        body: ['Tajawal', 'sans-serif'],
      },
      boxShadow: {
        'neon-pink': '0 0 20px rgba(217, 70, 239, 0.5)',
        'neon-blue': '0 0 20px rgba(6, 182, 212, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'chic-gradient': 'linear-gradient(135deg, #D946EF 0%, #8B5CF6 100%)',
      }
    },
  },
  plugins: [],
}