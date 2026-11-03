import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './layouts/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}',
    './plugins/**/*.{vue,js,ts,jsx,tsx}',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          canvas: '#2B3B46',       // Fondo base slate-blue oscuro atmosférico
          surface: '#3A4C58',      // Gradiente de apoyo
          card: 'rgba(255, 255, 255, 0.12)', // Vidrio escarchado primario
          cardBorder: 'rgba(255, 255, 255, 0.22)', // Borde especular
          pill: 'rgba(255, 255, 255, 0.18)', // Chips de amenidades
          pillHover: 'rgba(255, 255, 255, 0.28)',
          textPrimary: '#FFFFFF',  // Títulos y valores clave
          textMuted: '#CBD5E1',    // Subtítulos e info secundaria
          textDim: '#94A3B8',      // Labels y textos de apoyo
          accentGold: '#D4AF37',   // Estrellas de rating / insignias VIP
          ctaBg: '#FFFFFF',        // Botón principal 'Book Now' blanco puro
          ctaText: '#1E293B',      // Texto del CTA en slate profundo
        }
      },
      borderRadius: {
        'luxury-card': '32px',
        'luxury-pill': '9999px',
        'luxury-subcard': '24px'
      },
      boxShadow: {
        'glass-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        'specular': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)'
      },
      backdropBlur: {
        'glass': '24px',
        'glass-heavy': '40px'
      }
    }
  }
}
