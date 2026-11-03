<template>
  <div class="space-y-6 pb-28">
    <!-- Barra superior de navegación / Volver -->
    <div class="flex items-center justify-between pt-2">
      <button
        @click="bookingStore.goBackToDiscovery"
        class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-luxury-pill bg-white/10 backdrop-blur-glass border border-luxury-cardBorder text-xs font-semibold text-white hover:bg-white/20 transition-all cursor-pointer"
      >
        <ChevronLeft class="w-4 h-4" />
        <span>Volver a Experiencias</span>
      </button>

      <div class="flex items-center gap-1 px-3 py-1 rounded-luxury-pill bg-luxury-pill text-xs font-semibold text-luxury-accentGold border border-luxury-cardBorder">
        <Star class="w-3.5 h-3.5 fill-luxury-accentGold" />
        <span>{{ zone.rating }} VIP</span>
      </div>
    </div>

    <!-- Hero Visual con ambientación real de la zona -->
    <div class="glass-panel rounded-luxury-card overflow-hidden shadow-glass-glow relative">
      <div class="relative h-64 w-full">
        <img
          :src="zone.imageUrl"
          :alt="zone.name"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#2B3B46] via-[#2B3B46]/50 to-transparent"></div>

        <div class="absolute bottom-4 left-5 right-5">
          <span class="inline-block px-3 py-1 rounded-luxury-pill bg-white/15 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20 mb-2">
            Mesa VIP Seleccionada
          </span>
          <h1 class="text-2xl font-black text-white leading-tight">
            {{ zone.name }}
          </h1>
          <p class="text-xs text-luxury-accentGold font-medium mt-1">
            {{ zone.subtitle }} • {{ zone.pricePerPerson }} estimado
          </p>
        </div>
      </div>

      <!-- Amenidades de la zona -->
      <div class="p-5 border-t border-luxury-cardBorder/40">
        <p class="text-xs text-luxury-textMuted leading-relaxed mb-4">
          {{ zone.description }}
        </p>

        <h3 class="text-xs uppercase tracking-wider text-luxury-textDim font-bold mb-2.5">
          Amenidades Exclusivas
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="amenity in zone.amenities"
            :key="amenity.name"
            class="px-3 py-1.5 rounded-luxury-pill bg-luxury-pill text-xs text-white border border-luxury-cardBorder flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles class="w-3.5 h-3.5 text-luxury-accentGold" />
            {{ amenity.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- Selector interactivo de Fecha (Píldoras horizontales) -->
    <div class="space-y-2.5">
      <div class="flex items-center justify-between px-1">
        <label class="text-xs uppercase tracking-wider text-luxury-textDim font-bold flex items-center gap-1.5">
          <Calendar class="w-3.5 h-3.5 text-luxury-accentGold" />
          Fecha de la Experiencia
        </label>
        <span class="text-xs text-luxury-textMuted font-medium">{{ formattedSelectedDate }}</span>
      </div>

      <div class="overflow-x-auto no-scrollbar -mx-4 px-4 py-1 flex items-center gap-2.5">
        <button
          v-for="day in availableDates"
          :key="day.iso"
          @click="bookingStore.date = day.iso"
          :class="[
            'flex flex-col items-center justify-center min-w-[72px] py-3 px-3 rounded-2xl border transition-all duration-200 cursor-pointer',
            bookingStore.date === day.iso
              ? 'bg-white text-[#1E293B] border-white shadow-lg scale-105 font-bold'
              : 'bg-white/10 text-white border-luxury-cardBorder hover:bg-white/15'
          ]"
        >
          <span class="text-[10px] uppercase font-semibold opacity-75">{{ day.label }}</span>
          <span class="text-lg font-black mt-0.5">{{ day.dayNumber }}</span>
          <span class="text-[10px] opacity-80">{{ day.month }}</span>
        </button>
      </div>
    </div>

    <!-- Selector interactivo de Horarios (Píldoras táctiles horizontales) -->
    <div class="space-y-2.5">
      <div class="flex items-center justify-between px-1">
        <label class="text-xs uppercase tracking-wider text-luxury-textDim font-bold flex items-center gap-1.5">
          <Clock class="w-3.5 h-3.5 text-luxury-accentGold" />
          Horario del Servicio
        </label>
        <span class="text-xs text-luxury-accentGold font-semibold">{{ bookingStore.time }} hrs</span>
      </div>

      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="timeSlot in availableTimes"
          :key="timeSlot"
          @click="bookingStore.time = timeSlot"
          :class="[
            'py-2.5 px-2 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer',
            bookingStore.time === timeSlot
              ? 'bg-white text-[#1E293B] border-white shadow-md'
              : 'bg-white/10 text-white border-luxury-cardBorder hover:bg-white/15'
          ]"
        >
          {{ timeSlot }}
        </button>
      </div>
    </div>

    <!-- Selector de Comensales -->
    <div class="space-y-2.5">
      <div class="flex items-center justify-between px-1">
        <label class="text-xs uppercase tracking-wider text-luxury-textDim font-bold flex items-center gap-1.5">
          <Users class="w-3.5 h-3.5 text-luxury-accentGold" />
          Número de Comensales
        </label>
        <span class="text-xs text-luxury-textMuted font-medium">Mesa para {{ bookingStore.partySize }} personas</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-for="size in [1, 2, 3, 4, 5, 6, 8]"
          :key="size"
          @click="bookingStore.partySize = size"
          :class="[
            'flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer',
            bookingStore.partySize === size
              ? 'bg-white text-[#1E293B] border-white shadow-md font-extrabold'
              : 'bg-white/10 text-white border-luxury-cardBorder hover:bg-white/15'
          ]"
        >
          {{ size }}
        </button>
      </div>
    </div>

    <!-- Inputs Mínimos en un Contenedor Glass (0 fricción: solo Nombre y WhatsApp) -->
    <div class="glass-panel rounded-luxury-card p-5 space-y-4 shadow-glass-glow border border-luxury-cardBorder">
      <div class="flex items-center gap-2 mb-1">
        <UserCheck class="w-4 h-4 text-luxury-accentGold" />
        <h3 class="text-sm font-bold text-white">Datos del Titular de la Mesa</h3>
      </div>
      <p class="text-xs text-luxury-textDim -mt-2">
        Sin contraseñas. Tu pase digital se asociará a este número para acceso sin fila.
      </p>

      <!-- Input Nombre Completo -->
      <div class="space-y-1.5">
        <label class="text-xs font-medium text-luxury-textMuted block">Nombre Completo</label>
        <div class="relative">
          <input
            v-model="bookingStore.guestName"
            type="text"
            placeholder="Ej. Lic. Roberto Morales"
            class="w-full bg-black/25 text-white placeholder-luxury-textDim/60 text-sm rounded-xl px-4 py-3 border border-luxury-cardBorder focus:outline-none focus:border-luxury-accentGold transition-colors"
          />
        </div>
      </div>

      <!-- Input WhatsApp (E.164) -->
      <div class="space-y-1.5">
        <label class="text-xs font-medium text-luxury-textMuted block">WhatsApp Móvil (E.164)</label>
        <div class="relative flex items-center">
          <span class="absolute left-3.5 text-xs font-bold text-luxury-textMuted select-none flex items-center gap-1">
            🇲🇽 +52
          </span>
          <input
            v-model="phoneDigits"
            type="tel"
            placeholder="55 1234 5678"
            class="w-full bg-black/25 text-white placeholder-luxury-textDim/60 text-sm rounded-xl pl-20 pr-4 py-3 border border-luxury-cardBorder focus:outline-none focus:border-luxury-accentGold transition-colors"
          />
        </div>
      </div>

      <!-- Peticiones Especiales (Opcional) -->
      <div class="space-y-1.5 pt-1">
        <label class="text-xs font-medium text-luxury-textMuted block">Petición Especial / Ocasión (Opcional)</label>
        <input
          v-model="bookingStore.specialRequests"
          type="text"
          placeholder="Ej. Aniversario, mesa junto al ventanal..."
          class="w-full bg-black/25 text-white placeholder-luxury-textDim/60 text-sm rounded-xl px-4 py-2.5 border border-luxury-cardBorder focus:outline-none focus:border-luxury-accentGold transition-colors text-xs"
        />
      </div>
    </div>

    <!-- Botón Sticky Inferior "Book Now" -->
    <BookingStickyFooter
      :loading="bookingStore.isSubmitting"
      :disabled="!canSubmit"
      @submit="handleConfirm"
    >
      <span class="font-bold">Apartar Mesa VIP</span>
      <span class="text-xs bg-[#1E293B] text-white px-2 py-0.5 rounded-full font-medium ml-1">
        {{ zone.pricePerPerson }}
      </span>
    </BookingStickyFooter>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { ChevronLeft, Star, Sparkles, Calendar, Clock, Users, UserCheck } from 'lucide-vue-next'
import { useBookingStore } from '~/stores/booking'

const bookingStore = useBookingStore()
const zone = computed(() => bookingStore.selectedZone)

// Phone number handling with +52 prefix
const phoneDigits = ref(
  bookingStore.guestPhone.startsWith('+52')
    ? bookingStore.guestPhone.replace('+52', '').trim()
    : bookingStore.guestPhone
)

watch(phoneDigits, (val) => {
  const cleaned = val.replace(/\D/g, '')
  bookingStore.guestPhone = cleaned ? `+52 ${cleaned}` : ''
})

// Horarios de cena y degustación
const availableTimes = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30']

// Próximos 7 días calculados dinámicamente
const availableDates = computed(() => {
  const days = []
  const today = new Date()
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(today.getDate() + i)
    const iso = d.toISOString().split('T')[0]
    days.push({
      iso,
      label: i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : daysOfWeek[d.getDay()],
      dayNumber: d.getDate(),
      month: months[d.getMonth()]
    })
  }
  return days
})

const formattedSelectedDate = computed(() => {
  const match = availableDates.value.find(d => d.iso === bookingStore.date)
  if (match) return `${match.label} ${match.dayNumber} de ${match.month}`
  return bookingStore.date
})

const canSubmit = computed(() => {
  return bookingStore.guestName.trim().length >= 2 && phoneDigits.value.replace(/\D/g, '').length >= 10
})

const handleConfirm = async () => {
  if (!canSubmit.value) {
    if (bookingStore.guestName.trim().length < 2) {
      alert('Por favor introduce el nombre del titular para la reserva.')
      return
    }
    if (phoneDigits.value.replace(/\D/g, '').length < 10) {
      alert('Por favor introduce un teléfono celular de 10 dígitos para confirmación vía WhatsApp.')
      return
    }
  }
  await bookingStore.submitReservation()
}
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
