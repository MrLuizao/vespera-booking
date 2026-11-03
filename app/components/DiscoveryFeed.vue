<template>
  <div class="space-y-6 pb-12">
    <!-- Header Web con saludo personalizado -->
    <header class="pt-2">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          <span class="text-[11px] uppercase tracking-widest text-luxury-textDim font-semibold">Gastro-AI VIP Suite</span>
        </div>
        
        <!-- UTM Source Pill / VIP Badge -->
        <div class="flex items-center gap-1.5 px-3 py-1 rounded-luxury-pill bg-white/10 backdrop-blur-glass border border-luxury-cardBorder text-[11px] font-medium text-luxury-textPrimary">
          <Sparkles class="w-3.5 h-3.5 text-luxury-accentGold" />
          <span>{{ sourceLabel }}</span>
        </div>
      </div>

      <h1 class="text-3xl font-extrabold tracking-tight text-white leading-tight">
        <span v-if="bookingStore.guestName">
          Welcome back,<br />
          <span class="text-luxury-accentGold">{{ bookingStore.guestName }}</span>
        </span>
        <span v-else>
          Mesa VIP<br />
          <span class="text-luxury-accentGold">Inmediata</span>
        </span>
      </h1>
      <p class="text-sm text-luxury-textMuted mt-2 leading-relaxed">
        Reserva experiencias de alta gastronomía en 30 segundos sin contraseñas ni registros.
      </p>
    </header>

    <!-- Selector rápido de Zonas / Filtros de Experiencias -->
    <div class="overflow-x-auto no-scrollbar -mx-4 px-4 py-1 flex items-center gap-2">
      <button
        @click="activeCategory = 'all'"
        :class="[
          'px-4 py-2 rounded-luxury-pill text-xs font-semibold whitespace-nowrap transition-all duration-300 border cursor-pointer',
          activeCategory === 'all'
            ? 'bg-white text-[#1E293B] border-white shadow-lg'
            : 'bg-white/10 text-luxury-textMuted border-luxury-cardBorder hover:bg-white/15'
        ]"
      >
        Todas las Áreas
      </button>
      <button
        v-for="zone in EXPERIENCES"
        :key="zone.id"
        @click="activeCategory = zone.id"
        :class="[
          'px-4 py-2 rounded-luxury-pill text-xs font-semibold whitespace-nowrap transition-all duration-300 border cursor-pointer',
          activeCategory === zone.id
            ? 'bg-white text-[#1E293B] border-white shadow-lg'
            : 'bg-white/10 text-luxury-textMuted border-luxury-cardBorder hover:bg-white/15'
        ]"
      >
        {{ zone.name.split(' ')[0] }} {{ zone.name.split(' ')[1] || '' }}
      </button>
    </div>

    <!-- Lista de Cards Escarchadas con Vidrio Hiperrealista -->
    <div class="space-y-6">
      <article
        v-for="zone in filteredExperiences"
        :key="zone.id"
        @click="bookingStore.selectZone(zone.id)"
        class="glass-panel rounded-luxury-card overflow-hidden transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer group shadow-glass-glow"
      >
        <!-- Foto inmersiva de la zona con gradiente atmosférico -->
        <div class="relative h-56 w-full overflow-hidden">
          <img
            :src="zone.imageUrl"
            :alt="zone.name"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#2B3B46] via-[#2B3B46]/40 to-transparent"></div>

          <!-- Badges superiores -->
          <div class="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span v-if="zone.badge" class="px-3 py-1 rounded-luxury-pill bg-black/40 backdrop-blur-md text-[11px] font-semibold text-luxury-accentGold border border-luxury-accentGold/40">
              {{ zone.badge }}
            </span>
            <div class="ml-auto flex items-center gap-1 px-3 py-1 rounded-luxury-pill bg-black/50 backdrop-blur-md text-xs font-bold text-white border border-white/20">
              <Star class="w-3.5 h-3.5 fill-luxury-accentGold text-luxury-accentGold" />
              <span>{{ zone.rating }}</span>
              <span class="text-luxury-textDim font-normal">({{ zone.reviewCount }})</span>
            </div>
          </div>

          <!-- Consumo sugerido flotante -->
          <div class="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <p class="text-[11px] text-luxury-textMuted uppercase tracking-wider font-semibold">Consumo estimado</p>
              <p class="text-xl font-bold text-white tracking-tight">{{ zone.pricePerPerson }} <span class="text-xs font-normal text-luxury-textDim">/ persona</span></p>
            </div>
            <div class="w-9 h-9 rounded-full bg-white text-[#1E293B] flex items-center justify-center shadow-lg group-hover:translate-x-1 transition-transform">
              <ArrowRight class="w-4 h-4" />
            </div>
          </div>
        </div>

        <!-- Información de la Experiencia -->
        <div class="p-5">
          <h2 class="text-xl font-bold text-white group-hover:text-luxury-accentGold transition-colors">
            {{ zone.name }}
          </h2>
          <p class="text-xs text-luxury-accentGold font-medium mt-0.5 mb-2.5">
            {{ zone.subtitle }}
          </p>
          <p class="text-xs text-luxury-textMuted leading-relaxed line-clamp-2 mb-4">
            {{ zone.description }}
          </p>

          <!-- Chips de amenidades encapsulados -->
          <div class="flex flex-wrap gap-1.5 pt-1">
            <span
              v-for="amenity in zone.amenities.slice(0, 3)"
              :key="amenity.name"
              class="px-2.5 py-1 rounded-luxury-pill bg-white/10 text-[11px] text-luxury-textMuted border border-luxury-cardBorder flex items-center gap-1.5"
            >
              <Sparkles class="w-3 h-3 text-luxury-accentGold" />
              {{ amenity.name }}
            </span>
            <span v-if="zone.amenities.length > 3" class="px-2.5 py-1 rounded-luxury-pill bg-white/5 text-[10px] text-luxury-textDim border border-luxury-cardBorder">
              +{{ zone.amenities.length - 3 }} más
            </span>
          </div>
        </div>
      </article>
    </div>

    <!-- Garantía VIP Footer Card -->
    <div class="glass-panel rounded-luxury-subcard p-4 border border-luxury-cardBorder flex items-center gap-3.5">
      <div class="w-10 h-10 rounded-full bg-luxury-accentGold/20 border border-luxury-accentGold/40 flex items-center justify-center shrink-0">
        <ShieldCheck class="w-5 h-5 text-luxury-accentGold" />
      </div>
      <div>
        <h4 class="text-xs font-bold text-white">Confirmación Inmediata con Apple & Google Wallet</h4>
        <p class="text-[11px] text-luxury-textDim mt-0.5">Mesa asegurada con prioridad de anfitrión. Sin costos ocultos.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sparkles, Star, ArrowRight, ShieldCheck } from 'lucide-vue-next'
import { useBookingStore } from '~/stores/booking'
import { EXPERIENCES } from '~/data/experiences'

const bookingStore = useBookingStore()
const activeCategory = ref<'all' | 'terraza' | 'cava' | 'salon-principal'>('all')

const sourceLabel = computed(() => {
  if (bookingStore.utmSource === 'INSTAGRAM') return 'Instagram VIP Access'
  if (bookingStore.utmSource === 'GOOGLE_MAPS') return 'Google Maps Direct'
  return 'VIP Experience'
})

const filteredExperiences = computed(() => {
  if (activeCategory.value === 'all') return EXPERIENCES
  return EXPERIENCES.filter(e => e.id === activeCategory.value)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
