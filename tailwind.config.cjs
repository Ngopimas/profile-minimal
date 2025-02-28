function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(--${variableName}), ${opacityValue})`;
    }
    return `rgb(var(--${variableName}))`;
  };
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["selector", "[data-theme='dark']"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        'title': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'subheading': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        'lg': ['1.125rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'xs': ['0.75rem', { lineHeight: '1.4' }],
      },
      textColor: {
        skin: {
          base: withOpacity("color-text-base"),
          accent: withOpacity("color-accent"),
          secondary: withOpacity("color-accent-secondary"),
          muted: withOpacity("color-text-base"),
          inverted: withOpacity("color-fill"),
          success: withOpacity("color-success"),
          error: withOpacity("color-error"),
          warning: withOpacity("color-warning"),
        },
      },
      backgroundColor: {
        skin: {
          fill: withOpacity("color-fill"),
          accent: withOpacity("color-accent"),
          "accent-secondary": withOpacity("color-accent-secondary"),
          inverted: withOpacity("color-text-base"),
          card: withOpacity("color-card"),
          "card-muted": withOpacity("color-card-muted"),
          success: withOpacity("color-success"),
          error: withOpacity("color-error"),
          warning: withOpacity("color-warning"),
        },
      },
      gradientColorStops: {
        skin: {
          accent: withOpacity("color-accent"),
          secondary: withOpacity("color-accent-secondary"),
        },
      },
      outlineColor: {
        skin: {
          fill: withOpacity("color-accent"),
        },
      },
      borderColor: {
        skin: {
          line: withOpacity("color-border"),
          fill: withOpacity("color-text-base"),
          accent: withOpacity("color-accent"),
          secondary: withOpacity("color-accent-secondary"),
        },
      },
      ringColor: {
        skin: {
          base: withOpacity("color-text-base"),
          accent: withOpacity("color-accent"),
          secondary: withOpacity("color-accent-secondary"),
          fill: withOpacity("color-fill"),
        },
      },
      fill: {
        skin: {
          base: withOpacity("color-text-base"),
          accent: withOpacity("color-accent"),
          secondary: withOpacity("color-accent-secondary"),
        },
        transparent: "transparent",
      },
      stroke: {
        skin: {
          base: withOpacity("color-text-base"),
          accent: withOpacity("color-accent"),
          secondary: withOpacity("color-accent-secondary"),
        }
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      spacing: {
        'xs': 'var(--space-xs)',
        'sm': 'var(--space-sm)',
        'md': 'var(--space-md)',
        'lg': 'var(--space-lg)',
        'xl': 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
      },
      typography: {
        DEFAULT: {
          css: {
            pre: {
              color: false,
            },
            code: {
              color: false,
            },
            h1: {
              fontWeight: 'var(--font-weight-light)',
              letterSpacing: '-0.02em',
            },
            h2: {
              fontWeight: 'var(--font-weight-light)',
              letterSpacing: '-0.01em',
            },
            h3: {
              fontWeight: 'var(--font-weight-regular)',
              letterSpacing: '-0.01em',
            },
            p: {
              lineHeight: '1.6',
            },
            a: {
              fontWeight: 'var(--font-weight-medium)',
              textDecoration: 'none',
              '&:hover': {
                opacity: 0.8,
              },
            },
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
