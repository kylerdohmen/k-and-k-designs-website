/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      // Carousel-specific extensions
      animation: {
        'carousel-fade-in': 'carouselFadeIn 0.8s ease-out forwards',
        'carousel-fade-out': 'carouselFadeOut 0.8s ease-out forwards',
        'carousel-slide-up': 'carouselSlideUp 0.8s ease-out forwards',
        'carousel-slide-down': 'carouselSlideDown 0.8s ease-out forwards',
        'carousel-scale-in': 'carouselScaleIn 0.8s ease-out forwards',
        'carousel-progress': 'carouselProgress 0.3s ease-out forwards',
      },
      keyframes: {
        carouselFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        carouselFadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
        carouselSlideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        carouselSlideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        carouselScaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        carouselProgress: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      transitionTimingFunction: {
        'carousel': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'carousel-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      transitionDuration: {
        '800': '800ms',
        '1200': '1200ms',
      },
      backdropBlur: {
        'carousel': '8px',
      },
      zIndex: {
        'carousel-background': '10',
        'carousel-content': '20',
        'carousel-overlay': '30',
        'carousel-controls': '40',
      },
      screens: {
        'carousel-mobile': '480px',
        'carousel-tablet': '768px',
        'carousel-desktop': '1024px',
        'carousel-wide': '1440px',
      },
    },
  },
  plugins: [
    // Custom carousel utilities plugin
    function({ addUtilities, theme }) {
      const carouselUtilities = {
        '.carousel-container': {
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        },
        '.carousel-section': {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '.carousel-background': {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: theme('zIndex.carousel-background'),
        },
        '.carousel-content': {
          position: 'relative',
          zIndex: theme('zIndex.carousel-content'),
          textAlign: 'center',
          color: 'white',
          maxWidth: '800px',
          padding: theme('spacing.8'),
        },
        '.carousel-overlay': {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5))',
          zIndex: theme('zIndex.carousel-overlay'),
        },
        '.carousel-progress-bar': {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.2)',
          zIndex: theme('zIndex.carousel-controls'),
        },
        '.carousel-progress-fill': {
          height: '100%',
          background: 'white',
          transformOrigin: 'left',
          transition: 'transform 0.3s ease-out',
        },
        '.carousel-scroll-indicator': {
          position: 'fixed',
          right: theme('spacing.8'),
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: theme('zIndex.carousel-controls'),
          display: 'flex',
          flexDirection: 'column',
          gap: theme('spacing.2'),
        },
        '.carousel-dot': {
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.4)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        },
        '.carousel-dot-active': {
          background: 'white',
          transform: 'scale(1.2)',
        },
        '.carousel-skip-link': {
          position: 'absolute',
          top: '-40px',
          left: theme('spacing.4'),
          background: theme('colors.primary.600'),
          color: 'white',
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          textDecoration: 'none',
          borderRadius: theme('borderRadius.md'),
          zIndex: '9999',
          transition: 'top 0.3s ease',
        },
        '.carousel-skip-link:focus': {
          top: theme('spacing.4'),
        },
        // Responsive utilities
        '@media (max-width: 768px)': {
          '.carousel-content': {
            padding: theme('spacing.4'),
            maxWidth: '90%',
          },
          '.carousel-scroll-indicator': {
            right: theme('spacing.4'),
          },
        },
        // Reduced motion utilities
        '@media (prefers-reduced-motion: reduce)': {
          '.carousel-section': {
            transition: 'none',
          },
          '.carousel-progress-fill': {
            transition: 'none',
          },
          '.carousel-dot': {
            transition: 'none',
          },
        },
      };

      addUtilities(carouselUtilities);
    },
  ],
}