/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        'dark-900': '#080808',
        'dark-800': '#101010',
        'dark-700': '#161616',
        'border-subtle': '#242424',
        'border-medium': '#383838',
        yellow: {
          DEFAULT: '#FFD600',
          light: '#FFF176',
          dim: '#D4B000',
        },
        warm: '#F5F5F5',
        'text-main': '#F5F5F5',
        'text-muted': '#999999',
        'text-dim': '#555555',
        expense: {
          DEFAULT: '#FF5252',
          dim: '#7f1d1d',
          bg: '#1a0808'
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        arcade: ['"Silkscreen"', 'monospace'],
        mono: ['"Space Mono"', 'monospace', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
