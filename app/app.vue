<template>
  <div class="relative min-h-[100dvh] text-white flex items-center justify-center p-0 sm:p-4 overflow-x-hidden selection:bg-white/20">
    <!-- Video Cinematográfico de Restaurante VIP en la BASE -->
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#0D1317]">
      <video
        ref="baseVideoRef"
        :key="activeVideoSrc"
        :src="activeVideoSrc"
        poster="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1400&q=80"
        autoplay
        loop
        muted
        playsinline
        webkit-playsinline
        disablePictureInPicture
        disableRemotePlayback
        class="w-full h-full object-cover object-center transition-opacity duration-700"
      ></video>
      <!-- Capa de contraste cinematográfico para resaltar el texto blanco y el diseño Liquid Glass -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/75"></div>
      <div class="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-[#FFA000]/12 blur-[150px]"></div>
    </div>

    <!-- Contenedor del dispositivo móvil (Capa z-10, transparente sobre el video) -->
    <div class="relative z-10 w-full max-w-[420px] h-[100dvh] sm:h-[880px] flex flex-col justify-between p-3 sm:p-0">
      <!-- ================= HEADER GLOBAL DEL RESTAURANTE (FUERA DE LA CARD) ================= -->
      <header class="w-full px-5 pt-3 pb-2 flex items-center justify-between shrink-0 z-40">
        <div class="flex items-center gap-2.5">
          <div class="flex items-center justify-center">
            <svg class="w-7 h-7 text-[#FFB347]" viewBox="0 0 32 32" fill="currentColor">
              <ellipse cx="12" cy="16" rx="6" ry="10" transform="rotate(-15 12 16)" opacity="0.9" />
              <ellipse cx="20" cy="16" rx="6" ry="10" transform="rotate(15 20 16)" opacity="0.9" />
              <circle cx="16" cy="16" r="4.5" fill="#FFA000" />
            </svg>
          </div>
          <div class="leading-tight">
            <span class="text-base font-medium tracking-tight text-white/95 font-sans block">
              Vespera <span class="text-[#FFB347] font-semibold">Hub</span>
            </span>
            <span class="text-[10px] uppercase tracking-widest text-white/65 block">
              Metepec · Fuego, Cava &amp; Lounge
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Botón volver contextual si estamos en pantallas posteriores -->
          <button
            v-if="step !== 'informative'"
            @click="step = 'informative'"
            class="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-medium text-white/90 transition-all cursor-pointer backdrop-blur-md"
          >
            <span>← Volver</span>
          </button>

          <!-- Botón de ficha del restaurante y selector de video en vivo -->
          <!-- <button
            v-else
            @click="showMenu = true"
            class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 hover:bg-white/15 border border-white/15 text-[11px] font-medium text-amber-300 transition-all cursor-pointer backdrop-blur-md"
          >
            <span>🎬 Video / Info</span>
          </button> -->
        </div>
      </header>

      <!-- ================= CONTENIDO DE LAS CARDS (DEBAJO DEL HEADER) ================= -->
      <main class="flex-1 min-h-0 w-full flex flex-col relative">
        <Transition name="screen-crossfade" mode="out-in">
          <!-- Paso 1: Vista Informativa del Restaurante con Zonas, Galería y Menú Insignia -->
          <ViewInformative
            v-if="step === 'informative'"
            key="informative"
            @startBooking="step = 'booking'"
          />

          <!-- Paso 2: Pantalla de Reservar Mesa VIP -->
          <ViewBooking
            v-else-if="step === 'booking'"
            key="booking"
            @back="step = 'informative'"
            @confirmed="step = 'ticket'"
          />

          <!-- Paso 3: Boleto VIP para Apple Wallet / Google Wallet -->
          <ViewWalletTicket
            v-else-if="step === 'ticket'"
            key="ticket"
            @reset="step = 'informative'"
          />
        </Transition>
      </main>

      <!-- Modal de Información del Restaurante en Metepec + Selector de Video en Vivo -->
      <div
        v-if="showMenu"
        class="absolute inset-0 bg-[#0F171E]/95 backdrop-blur-2xl p-6 z-50 flex flex-col justify-between rounded-[40px] border border-white/20 m-3 animate-fade-in overflow-y-auto"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span class="text-sm font-bold text-white uppercase tracking-wider block">Vespera Hub · Metepec</span>
              <span class="text-[11px] text-amber-400">Zona Dorada · Cocina de Fuego, Cava &amp; Fire Pit</span>
            </div>
            <button @click="showMenu = false" class="text-white/60 hover:text-white p-1.5 rounded-full bg-white/5 cursor-pointer">✕</button>
          </div>

          <!-- Selector rápido de Videos de Fondo para probar en vivo -->
          <div class="space-y-2 bg-black/40 p-3.5 rounded-2xl border border-white/15">
            <span class="text-[10px] uppercase tracking-wider font-bold text-amber-300 block">
              🎬 Prueba otro Video de Fondo en Vivo
            </span>
            <div class="grid grid-cols-2 gap-1.5">
              <button
                v-for="vid in videoCatalog"
                :key="vid.url"
                @click="bookingStore.customVideoUrl = vid.url"
                :class="[
                  'p-2 rounded-xl text-left text-[11px] border transition-all cursor-pointer',
                  activeVideoSrc === vid.url
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-300'
                    : 'bg-white/5 text-white/85 border-white/10 hover:bg-white/10'
                ]"
              >
                <span class="block truncate">{{ vid.label }}</span>
                <span class="text-[9px] opacity-70 block truncate">{{ vid.source }}</span>
              </button>
            </div>
            <div class="pt-1">
              <input
                v-model="bookingStore.customVideoUrl"
                type="text"
                placeholder="O pega aquí cualquier link .mp4 de Mixkit / Pexels..."
                class="w-full bg-black/60 text-white placeholder-slate-400/60 text-[11px] rounded-xl px-3 py-2 border border-white/15 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div class="rounded-2xl overflow-hidden h-28 relative border border-white/15">
            <img
              src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80"
              alt="Vespera Hub Metepec"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end p-3">
              <span class="text-xs text-white font-medium">📍 Av. Ignacio Comonfort 1500, Zona Dorada, Metepec</span>
            </div>
          </div>

          <div class="space-y-2.5 text-xs text-slate-300 leading-relaxed">
            <div class="flex items-center justify-between py-1.5 border-b border-white/10">
              <span class="text-slate-400">Horario en Metepec</span>
              <span class="text-white font-semibold">Mar – Dom · 13:30 a 01:00 hrs</span>
            </div>
            <div class="flex items-center justify-between py-1.5 border-b border-white/10">
              <span class="text-slate-400">Clima &amp; Confort</span>
              <span class="text-white font-semibold">Terraza Climatizada + Fire Pits</span>
            </div>
            <div class="flex items-center justify-between py-1.5">
              <span class="text-slate-400">Valet Parking VIP</span>
              <span class="text-emerald-400 font-semibold">Sobre Av. Comonfort (Con QR Wallet)</span>
            </div>
          </div>
        </div>
        <button
          @click="showMenu = false"
          class="w-full py-3.5 mt-3 rounded-full bg-white text-slate-900 font-bold text-xs shadow-lg cursor-pointer"
        >
          Aplicar y Volver al Restaurante
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useBookingStore } from '~/stores/booking'

const bookingStore = useBookingStore()
const step = ref<'informative' | 'booking' | 'ticket'>('informative')
const baseVideoRef = ref<HTMLVideoElement | null>(null)
const showMenu = ref(false)

const videoCatalog = [
  {
    label: '1. Salón Iluminación Cálida',
    source: 'Mixkit #29050',
    url: 'https://assets.mixkit.co/videos/29050/29050-720.mp4'
  },
  {
    label: '2. Terraza & Servicio',
    source: 'Mixkit #32457 (Local)',
    url: '/videos/restaurant-main.mp4'
  },
  {
    label: '3. Vino Tinto (La Cava)',
    source: 'Mixkit #41257 (Local)',
    url: '/videos/wine-pouring-41257.mp4'
  },
  {
    label: '4. Chef Alta Cocina',
    source: 'Mixkit #39535 (Local)',
    url: '/videos/salon-chef.mp4'
  }
]

const activeVideoSrc = computed(() => {
  if (bookingStore.customVideoUrl.trim()) {
    return bookingStore.customVideoUrl.trim()
  }
  return bookingStore.selectedZone?.videoUrl || 'https://assets.mixkit.co/videos/29050/29050-720.mp4'
})

watch(activeVideoSrc, () => {
  setTimeout(() => {
    baseVideoRef.value?.play().catch(() => {})
  }, 60)
})

useHead({
  title: 'Vespera Hub Metepec · Alta Cocina de Fuego, Cava & Fire Pit',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
    { name: 'description', content: 'Reserva tu mesa VIP en Vespera Hub (Zona Dorada, Metepec) con pase digital directo a Google Wallet y Apple Wallet.' }
  ]
})

onMounted(() => {
  bookingStore.initSession()
  if (baseVideoRef.value) {
    baseVideoRef.value.play().catch(() => {})
  }
})
</script>

<style>
/* Transición fluida y cinematográfica entre pantallas */
.screen-crossfade-enter-active,
.screen-crossfade-leave-active {
  transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.screen-crossfade-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}

.screen-crossfade-leave-to {
  opacity: 0;
  transform: translateY(-16px) scale(0.98);
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
