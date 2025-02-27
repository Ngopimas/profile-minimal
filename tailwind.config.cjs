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
      },
      fontSize: {
        'title': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'heading': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'subheading': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
      },
      textColor: {
        skin: {
          base: withOpacity("color-text-base"),
          accent: withOpacity("color-accent"),
          inverted: withOpacity("color-fill"),
          muted: withOpacity("color-text-muted"),
        },
      },
      backgroundColor: {
        skin: {
          fill: withOpacity("color-fill"),
          accent: withOpacity("color-accent"),
          inverted: withOpacity("color-text-base"),
          card: withOpacity("color-card"),
          "card-muted": withOpacity("color-card-muted"),
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
        },
      },
      fill: {
        skin: {
          base: withOpacity("color-text-base"),
          accent: withOpacity("color-accent"),
        },
        transparent: "transparent",
      },
      stroke: {
        skin: {
          accent: withOpacity("color-accent")
        }
      },
      strokeColor: {
        skin: {
          base: withOpacity("color-text-base"),
          accent: withOpacity("color-accent"),
        },
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
              fontWeight: '300',
              letterSpacing: '-0.02em',
            },
            h2: {
              fontWeight: '300',
              letterSpacing: '-0.01em',
            },
            h3: {
              fontWeight: '400',
              letterSpacing: '-0.01em',
            },
            p: {
              lineHeight: '1.6',
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
