import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
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
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			spacing: {
				// Semantic spacing tokens for consistent layouts
				'section-y': '5rem',      // 80px - Between major sections
				'section-y-sm': '3rem',   // 48px - Between sections on mobile
				'content-y': '3rem',      // 48px - Between content blocks
				'content-y-sm': '2rem',   // 32px - Between content blocks on mobile
				'element-y': '1.5rem',    // 24px - Between UI elements
				'element-y-sm': '1rem',   // 16px - Between UI elements (tight)
				'element-x': '1.5rem',    // 24px - Horizontal element spacing
				'card-padding': '1.5rem', // 24px - Default card padding
				'card-padding-lg': '2rem', // 32px - Large card padding
				'card-gap': '1.5rem',     // 24px - Gap between cards
			},
			colors: {
				// Custom palette colors - Forge brand
				forge: {
					// Orange scale (primary brand color)
					orange: {
						50: '#fff7ed',
						100: '#ffedd5',
						200: '#fed7aa',
						300: '#fdba74',
						400: '#fb923c',
						500: '#F4A261',  // Light orange
						600: '#E87A47',  // Main orange
						700: '#c2410c',
						800: '#9a3412',
						900: '#7c2d12',
						DEFAULT: '#E87A47',
					},
					// Dark green scale
					dark: {
						50: '#f6f7f6',
						100: '#e3e5e3',
						200: '#c6cac7',
						300: '#a0a8a2',
						400: '#7a857c',
						500: '#5f6b61',
						600: '#4a554c',
						700: '#3d463f',
						800: '#2D3A2E',  // Main dark
						900: '#1a221b',
						DEFAULT: '#2D3A2E',
					},
					// Cream/beige scale
					cream: {
						50: '#fefdfb',
						100: '#fdfbf7',
						200: '#faf7ef',
						300: '#F5F2E8',  // Main cream
						400: '#ebe7dd',
						500: '#d9d4ca',
						600: '#c4bfb5',
						700: '#a39e94',
						800: '#827d73',
						900: '#69655c',
						DEFAULT: '#F5F2E8',
					},
					// Gray scale
					gray: {
						50: '#f9f9f9',
						100: '#f3f3f3',
						200: '#e7e7e7',
						300: '#d4d4d4',
						400: '#a8a8a8',
						500: '#8E8E8E',  // Main gray
						600: '#737373',
						700: '#5a5a5a',
						800: '#3f3f3f',
						900: '#262626',
						DEFAULT: '#8E8E8E',
					},
				},

				// Semantic colors
				success: {
					50: '#f0fdf4',
					100: '#dcfce7',
					200: '#bbf7d0',
					300: '#86efac',
					400: '#4ade80',
					500: '#22c55e',
					600: '#16a34a',
					700: '#15803d',
					800: '#166534',
					900: '#14532d',
					DEFAULT: '#22c55e',
				},
				warning: {
					50: '#fefce8',
					100: '#fef9c3',
					200: '#fef08a',
					300: '#fde047',
					400: '#facc15',
					500: '#eab308',
					600: '#ca8a04',
					700: '#a16207',
					800: '#854d0e',
					900: '#713f12',
					DEFAULT: '#eab308',
				},
				info: {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					300: '#93c5fd',
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
					DEFAULT: '#3b82f6',
				},
				error: {
					50: '#fef2f2',
					100: '#fee2e2',
					200: '#fecaca',
					300: '#fca5a5',
					400: '#f87171',
					500: '#ef4444',
					600: '#dc2626',
					700: '#b91c1c',
					800: '#991b1b',
					900: '#7f1d1d',
					DEFAULT: '#ef4444',
				},
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
			backgroundImage: {
				// Brand gradients
				'gradient-brand': 'linear-gradient(135deg, #E87A47 0%, #F4A261 100%)',
				'gradient-brand-subtle': 'linear-gradient(135deg, #FEF7ED 0%, #F5F2E8 100%)',
				'gradient-brand-dark': 'linear-gradient(135deg, #2D3A2E 0%, #1a221b 100%)',

				// Contextual gradients
				'gradient-success': 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
				'gradient-warning': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
				'gradient-info': 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
				'gradient-error': 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',

				// Soft gradients (for cards/backgrounds)
				'gradient-soft-blue': 'linear-gradient(to bottom right, #eff6ff, #dbeafe)',
				'gradient-soft-green': 'linear-gradient(to bottom right, #f0fdf4, #dcfce7)',
				'gradient-soft-yellow': 'linear-gradient(to bottom right, #fefce8, #fef9c3)',
				'gradient-soft-purple': 'linear-gradient(to bottom right, #faf5ff, #f3e8ff)',
				'gradient-soft-orange': 'linear-gradient(to bottom right, #fff7ed, #ffedd5)',

				// Shimmer effect for loading states
				'shimmer': 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'marquee-left': {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-100%)' }
				},
				'marquee-right': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0%)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'glow': {
					'0%': { boxShadow: '0 0 20px rgba(232, 122, 71, 0.3)' },
					'100%': { boxShadow: '0 0 40px rgba(232, 122, 71, 0.6)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'slide-in-up': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-in-down': {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'marquee-left': 'marquee-left 22s linear infinite',
				'marquee-right': 'marquee-right 22s linear infinite',
				'float': 'float 6s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'shimmer': 'shimmer 2s linear infinite',
				'fade-in': 'fade-in 0.2s ease-out',
				'fade-out': 'fade-out 0.2s ease-out',
				'slide-in-up': 'slide-in-up 0.3s ease-out',
				'slide-in-down': 'slide-in-down 0.3s ease-out',
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
