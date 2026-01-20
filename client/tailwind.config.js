/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#124E66',
          dark: '#212A31',
          darker: '#2E3944',
          light: '#748D92',
        },
        secondary: {
          DEFAULT: '#748D92',
          dark: '#2E3944',
          darker: '#212A31',
          light: '#D3D9D4',
        },
        background: {
          DEFAULT: '#D3D9D4',
          light: '#FFFFFF',
        },
        text: {
          DEFAULT: '#212A31',
          secondary: '#2E3944',
          muted: '#748D92',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

