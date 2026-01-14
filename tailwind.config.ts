import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		keyframes: {
			'accordion-down': {
				from: { height: '0' },
				to: { height: 'var(--radix-accordion-content-height)' }
			},
			'accordion-up': {
				from: { height: 'var(--radix-accordion-content-height)' },
				to: { height: '0' }
			},
			'fade-in': {
				'0%': { opacity: '0', transform: 'translateY(10px)' },
				'100%': { opacity: '1', transform: 'translateY(0)' }
			},
			'fade-in-up': {
				'0%': { opacity: '0', transform: 'translateY(20px)' },
				'100%': { opacity: '1', transform: 'translateY(0)' }
			},
			'fade-in-down': {
				'0%': { opacity: '0', transform: 'translateY(-20px)' },
				'100%': { opacity: '1', transform: 'translateY(0)' }
			},
			'scale-in': {
				'0%': { opacity: '0', transform: 'scale(0.95)' },
				'100%': { opacity: '1', transform: 'scale(1)' }
			},
			'scale-out': {
				'0%': { opacity: '1', transform: 'scale(1)' },
				'100%': { opacity: '0', transform: 'scale(0.95)' }
			},
			'slide-in-right': {
				'0%': { transform: 'translateX(100%)' },
				'100%': { transform: 'translateX(0)' }
			},
			'slide-in-left': {
				'0%': { transform: 'translateX(-100%)' },
				'100%': { transform: 'translateX(0)' }
			},
			'slide-in-up': {
				'0%': { transform: 'translateY(100%)', opacity: '0' },
				'100%': { transform: 'translateY(0)', opacity: '1' }
			},
			'slide-in-down': {
				'0%': { transform: 'translateY(-100%)', opacity: '0' },
				'100%': { transform: 'translateY(0)', opacity: '1' }
			},
			'pulse-glow': {
				'0%, 100%': { boxShadow: '0 0 20px hsl(160 80% 50% / 0.2)' },
				'50%': { boxShadow: '0 0 40px hsl(160 80% 50% / 0.4)' }
			},
			float: {
				'0%, 100%': { transform: 'translateY(0)' },
				'50%': { transform: 'translateY(-10px)' }
			},
			confetti: {
				'0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
				'100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: '0' }
			},
			ripple: {
				'0%': { transform: 'scale(1)', opacity: '0.4' },
				'100%': { transform: 'scale(20)', opacity: '0' }
			},
			'bounce-in': {
				'0%': { transform: 'scale(0.3)', opacity: '0' },
				'50%': { transform: 'scale(1.05)' },
				'70%': { transform: 'scale(0.9)' },
				'100%': { transform: 'scale(1)', opacity: '1' }
			},
			'bounce-out': {
				'0%': { transform: 'scale(1)', opacity: '1' },
				'25%': { transform: 'scale(0.95)' },
				'50%': { transform: 'scale(1.1)', opacity: '0.5' },
				'100%': { transform: 'scale(0.3)', opacity: '0' }
			},
			shake: {
				'0%, 100%': { transform: 'translateX(0)' },
				'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
				'20%, 40%, 60%, 80%': { transform: 'translateX(4px)' }
			},
			wiggle: {
				'0%, 100%': { transform: 'rotate(-3deg)' },
				'50%': { transform: 'rotate(3deg)' }
			},
			'spin-slow': {
				'0%': { transform: 'rotate(0deg)' },
				'100%': { transform: 'rotate(360deg)' }
			},
			'gradient-shift': {
				'0%': { backgroundPosition: '0% 50%' },
				'50%': { backgroundPosition: '100% 50%' },
				'100%': { backgroundPosition: '0% 50%' }
			},
			'border-beam': {
				'0%': { offsetDistance: '0%' },
				'100%': { offsetDistance: '100%' }
			},
			shimmer: {
				'0%': { backgroundPosition: '-200% 0' },
				'100%': { backgroundPosition: '200% 0' }
			},
			'slide-up-fade': {
				'0%': { opacity: '0', transform: 'translateY(8px)' },
				'100%': { opacity: '1', transform: 'translateY(0)' }
			},
			'slide-down-fade': {
				'0%': { opacity: '0', transform: 'translateY(-8px)' },
				'100%': { opacity: '1', transform: 'translateY(0)' }
			},
			'zoom-in': {
				'0%': { opacity: '0', transform: 'scale(0.9)' },
				'100%': { opacity: '1', transform: 'scale(1)' }
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'fade-in': 'fade-in 0.5s ease-out forwards',
			'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
			'fade-in-down': 'fade-in-down 0.6s ease-out forwards',
			'scale-in': 'scale-in 0.3s ease-out forwards',
			'scale-out': 'scale-out 0.3s ease-out forwards',
			'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
			'slide-in-left': 'slide-in-left 0.4s ease-out forwards',
			'slide-in-up': 'slide-in-up 0.4s ease-out forwards',
			'slide-in-down': 'slide-in-down 0.4s ease-out forwards',
			'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
			float: 'float 6s ease-in-out infinite',
			confetti: 'confetti 3s ease-out forwards',
			ripple: 'ripple 600ms ease-out forwards',
			'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
			'bounce-out': 'bounce-out 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
			shake: 'shake 0.5s ease-in-out',
			wiggle: 'wiggle 0.3s ease-in-out infinite',
			'spin-slow': 'spin-slow 3s linear infinite',
			'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
			shimmer: 'shimmer 2s linear infinite',
			'slide-up-fade': 'slide-up-fade 0.3s ease-out forwards',
			'slide-down-fade': 'slide-down-fade 0.3s ease-out forwards',
			'zoom-in': 'zoom-in 0.3s ease-out forwards'
		},
  		fontFamily: {
  			sans: [
  				'DM Sans',
  				'ui-sans-serif',
  				'system-ui',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'Roboto',
  				'Helvetica Neue',
  				'Arial',
  				'Noto Sans',
  				'sans-serif'
  			],
  			serif: [
  				'Crimson Pro',
  				'ui-serif',
  				'Georgia',
  				'Cambria',
  				'Times New Roman',
  				'Times',
  				'serif'
  			],
  			mono: [
  				'SF Mono',
  				'ui-monospace',
  				'SFMono-Regular',
  				'Menlo',
  				'Monaco',
  				'Consolas',
  				'Liberation Mono',
  				'Courier New',
  				'monospace'
  			]
  		},
  		boxShadow: {
  			'2xs': 'var(--shadow-2xs)',
  			xs: 'var(--shadow-xs)',
  			sm: 'var(--shadow-sm)',
  			md: 'var(--shadow-md)',
  			lg: 'var(--shadow-lg)',
  			xl: 'var(--shadow-xl)',
  			'2xl': 'var(--shadow-2xl)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
