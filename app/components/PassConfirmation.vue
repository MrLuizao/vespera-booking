<template>
  <div class="space-y-6 pb-12 pt-2">
    <!-- Header de Éxito VIP -->
    <div class="text-center space-y-2">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 shadow-[0_0_30px_rgba(52,211,153,0.3)] animate-bounce">
        <CheckCircle2 class="w-8 h-8 text-emerald-400" />
      </div>
      <h1 class="text-2xl font-black text-white tracking-tight">
        Reserva Confirmada
      </h1>
      <p class="text-xs text-luxury-accentGold font-bold uppercase tracking-widest">
        Mesa VIP Apartada • Acceso Prioritario
      </p>
    </div>

    <!-- Código Alfanumérico Visible de Reserva (#GT-8942) -->
    <div class="glass-panel rounded-2xl p-4 text-center border border-luxury-cardBorder shadow-glass-glow flex items-center justify-between">
      <div class="text-left">
        <span class="text-[10px] uppercase font-bold text-luxury-textDim tracking-wider">Código de Reserva VIP</span>
        <p class="text-2xl font-black text-white tracking-widest font-mono">
          #{{ reservation.id }}
        </p>
      </div>

      <button
        @click="copyCode"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-luxury-pill bg-white/10 hover:bg-white/20 border border-luxury-cardBorder text-xs text-luxury-textMuted font-medium transition-all active:scale-95 cursor-pointer"
      >
        <Copy class="w-3.5 h-3.5" />
        <span>{{ copied ? '¡Copiado!' : 'Copiar' }}</span>
      </button>
    </div>

    <!-- Boarding Pass / Tarjeta Digital Escarchada -->
    <div class="glass-panel rounded-luxury-card overflow-hidden border border-luxury-cardBorder shadow-2xl relative">
      <!-- Encabezado de la Tarjeta Pase -->
      <div class="bg-gradient-to-r from-luxury-surface via-[#2B3B46] to-luxury-surface p-5 border-b border-luxury-cardBorder/40">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] uppercase tracking-widest text-luxury-accentGold font-bold">Pase Digital Gastronómico</span>
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
            ACTIVO
          </span>
        </div>
        <h2 class="text-lg font-bold text-white">{{ zone.name }}</h2>
        <p class="text-xs text-luxury-textMuted">{{ zone.subtitle }}</p>
      </div>

      <!-- Detalles del Pase -->
      <div class="p-5 space-y-4">
        <div class="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span class="text-[10px] uppercase font-bold text-luxury-textDim block">Titular</span>
            <span class="font-bold text-white text-sm">{{ reservation.guestName }}</span>
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-luxury-textDim block">WhatsApp</span>
            <span class="font-bold text-white text-sm">{{ reservation.guestPhone }}</span>
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-luxury-textDim block">Fecha y Hora</span>
            <span class="font-bold text-white text-sm">{{ reservation.date }} • {{ reservation.time }} hrs</span>
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-luxury-textDim block">Comensales</span>
            <span class="font-bold text-white text-sm">{{ reservation.partySize }} Personas</span>
          </div>
        </div>

        <div v-if="reservation.specialRequests" class="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-luxury-textMuted">
          <span class="font-semibold text-luxury-accentGold">Nota Especial:</span> {{ reservation.specialRequests }}
        </div>

        <!-- Divisor punteado estilo Boarding Pass -->
        <div class="relative py-2 flex items-center">
          <div class="border-t border-dashed border-luxury-cardBorder w-full"></div>
        </div>

        <!-- Simulación de Código QR para Check-in sin fila -->
        <div class="flex items-center justify-between pt-1">
          <div class="space-y-1">
            <span class="text-[10px] uppercase tracking-widest text-luxury-textDim font-bold block">Check-in Hostess</span>
            <p class="text-xs text-luxury-textMuted leading-tight">
              Muestra este pase en la recepción para ser escoltado a tu mesa.
            </p>
          </div>
          <div class="w-16 h-16 bg-white p-1 rounded-xl shadow-md shrink-0 flex items-center justify-center">
            <!-- Icono simulando matriz QR -->
            <QrCode class="w-14 h-14 text-slate-900" />
          </div>
        </div>
      </div>
    </div>

    <!-- Integración con Apple Wallet y Google Wallet (Sin popups bloqueables) -->
    <div class="space-y-3 pt-2">
      <h3 class="text-xs uppercase tracking-wider text-luxury-textDim font-bold text-center">
        Guarda tu credencial VIP en el teléfono
      </h3>

      <!-- Botón Nativo Apple Wallet (Descarga directa .pkpass vía browser) -->
      <!-- Regla: usar navegación nativa <a> o window.location.href directo para compatibilidad con In-App Browsers de Instagram/FB -->
      <a
        :href="reservation.applePassUrl"
        download="gastro-vip-pass.pkpass"
        class="w-full h-14 rounded-2xl bg-black text-white border border-white/20 hover:border-white/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer px-4 select-none"
      >
        <!-- Apple Wallet Official Style Badge -->
        <svg class="w-7 h-7 fill-current" viewBox="0 0 170 170">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.33-6.19-9.35-10.98-19.8-14.37-31.34-3.39-11.54-5.09-22.39-5.09-32.55 0-14.59 3.59-26.69 10.77-36.31 7.18-9.61 16.27-14.57 27.27-14.88 4.58 0 9.87 1.25 15.86 3.75 6 2.5 10.15 3.8 12.45 3.9 1.9.1 6.16-1.28 12.78-4.14 6.63-2.87 12.28-4.18 16.97-3.94 12.63.63 22.84 5.34 30.62 14.13-11.04 6.69-16.42 16.03-16.14 28.02.28 9.5 4.04 17.5 11.28 24 7.24 6.5 15.83 10.16 25.77 10.98-2.22 6.84-4.88 13.43-7.98 19.78zm-29.47-111.45c0 7.37-2.73 14.28-8.19 20.73-6.57 7.76-14.4 12.33-23.49 13.71-.34-1.42-.51-2.82-.51-4.2 0-7.1 2.94-14.22 8.82-21.36 2.94-3.57 6.61-6.52 11.01-8.86 4.4-2.33 8.52-3.57 12.36-3.72v3.7z"/>
        </svg>
        <div class="text-left leading-tight">
          <span class="text-[9px] uppercase tracking-wider block text-white/70">Añadir a</span>
          <span class="text-sm font-bold tracking-tight block">Apple Wallet</span>
        </div>
      </a>

      <!-- Botón Nativo Google Wallet (Enlace directo a API con JWT) -->
      <a
        :href="reservation.googleWalletUrl"
        class="w-full h-14 rounded-2xl bg-white text-[#1E293B] hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer px-4 select-none border border-slate-200"
      >
        <!-- Google Wallet Colors Icon -->
        <svg class="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <div class="text-left leading-tight">
          <span class="text-[9px] uppercase tracking-wider block text-slate-500 font-semibold">Guardar en</span>
          <span class="text-sm font-bold tracking-tight block text-[#1E293B]">Google Wallet</span>
        </div>
      </a>
    </div>

    <!-- Botón para Iniciar Otra Reserva o Volver -->
    <div class="pt-4 text-center">
      <button
        @click="bookingStore.resetToNewBooking"
        class="text-xs text-luxury-textDim hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
      >
        Volver a la selección de experiencias
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CheckCircle2, Copy, QrCode } from 'lucide-vue-next'
import { useBookingStore } from '~/stores/booking'

const bookingStore = useBookingStore()
const copied = ref(false)

const reservation = computed(() => {
  return bookingStore.confirmedReservation || {
    id: 'GT-8942',
    guestName: bookingStore.guestName || 'VIP Guest',
    guestPhone: bookingStore.guestPhone || '+52 55 1234 5678',
    date: bookingStore.date,
    time: bookingStore.time,
    partySize: bookingStore.partySize,
    specialRequests: bookingStore.specialRequests,
    applePassUrl: '/api/wallet/apple/GT-8942',
    googleWalletUrl: 'https://pay.google.com/gp/v/save/eyJhbGciOiJSUzI1NiJ9.GT-8942'
  }
})

const zone = computed(() => bookingStore.selectedZone)

const copyCode = async () => {
  if (import.meta.client && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(`#${reservation.value.id}`)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch {
      // Fallback
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }
  }
}
</script>
