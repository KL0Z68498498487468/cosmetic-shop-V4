/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pearl: '#fffaf7',
        blush: '#ffe5ee',
        accent: '#ff5d8f',
        accentDark: '#db3d74',
        roseBrown: '#8b5e6d',
        sand: '#f6efe8',
        cocoa: '#7a5a53',
        ink: '#20161b',
        mist: '#f8f4ff',
        mint: '#dff6ef',
        gold: '#d6b06a',
        line: '#ece2da'
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif']
      },
      boxShadow: {
        soft: '0 20px 60px rgba(126, 92, 109, 0.12)',
        card: '0 12px 30px rgba(32, 22, 27, 0.08)',
        glow: '0 15px 40px rgba(255, 93, 143, 0.18)'
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top left, rgba(255, 93, 143, 0.18), transparent 32%), radial-gradient(circle at 80% 10%, rgba(214, 176, 106, 0.18), transparent 24%), linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,250,247,0.9))',
        'soft-mesh':
          'radial-gradient(circle at 20% 20%, rgba(255,229,238,0.8), transparent 30%), radial-gradient(circle at 80% 0%, rgba(223,246,239,0.7), transparent 25%), radial-gradient(circle at 80% 80%, rgba(248,244,255,0.9), transparent 30%)'
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      screens: {
        xs: '480px'
      }
    }
  },
  plugins: []
};