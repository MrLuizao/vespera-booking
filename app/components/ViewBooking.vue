<template>
  <!-- Marco transparente con efecto de vidrio escarchado hiperrealista (Liquid Glassmorphism) -->
  <div class="relative w-full flex-1 min-h-0 h-full flex flex-col justify-between rounded-[36px] border border-white/25 bg-white/[0.03] backdrop-blur-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden [clip-path:inset(0_round_36px)]">
    <!-- Contenedor que distribuye los elementos ocupando todo el alto del canvas -->
    <div class="flex-1 min-h-0 overflow-y-auto no-scrollbar p-6 pt-5 pb-3 flex flex-col justify-between gap-3">
      <!-- Título directo de reservación de mesa -->
      <div class="space-y-0.5 shrink-0">
        <div class="flex items-center justify-between">
          <h2 class="text-[28px] leading-[1.1] font-normal tracking-[-0.02em] text-white font-sans">
            Reserva tu Mesa VIP
          </h2>
        </div>
        <p class="text-[11px] text-slate-300/80 font-light">
          Confirmación instantánea con pase directo a Google Wallet y Apple Wallet.
        </p>
      </div>

      <!-- ================= 1. ZONA DEL RESTAURANTE ================= -->
      <div class="space-y-1.5">
        <label class="text-[10px] uppercase tracking-wider font-bold text-slate-300/85 block px-1">
          1. Zona del Restaurante
        </label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="zone in experiences"
            :key="zone.id"
            type="button"
            @click="bookingStore.selectedZoneId = zone.id"
            :class="[
              'relative rounded-2xl overflow-hidden border p-2.5 h-20 flex flex-col justify-end text-left transition-all cursor-pointer',
              bookingStore.selectedZoneId === zone.id
                ? 'border-amber-400 ring-2 ring-amber-400/35 shadow-lg'
                : 'border-white/15 opacity-75 hover:opacity-100'
            ]"
          >
            <img :src="zone.imageUrl" :alt="zone.shortName" class="absolute inset-0 w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10"></div>
            <div class="relative z-10">
              <span class="text-[11px] font-bold text-white block leading-tight">{{ zone.shortName }}</span>
              <span class="text-[9px] text-amber-300 font-medium block truncate">{{ zone.badge }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- ================= 2. FECHA Y TURNO GASTRONÓMICO ================= -->
      <div class="space-y-1.5">
        <label class="text-[10px] uppercase tracking-wider font-bold text-slate-300/85 block px-1">
          2. Fecha y Horario de Mesa
        </label>

        <!-- Dos Cajas Gemelas Glass para Fecha y Horario -->
        <div class="grid grid-cols-2 gap-2.5">
          <!-- Caja Fecha -->
          <div
            @click="showDatePicker = !showDatePicker; showTimePicker = false"
            class="bg-black/45 hover:bg-black/60 border border-white/15 hover:border-white/30 rounded-2xl p-3 cursor-pointer transition-all"
          >
            <div class="flex items-center justify-between text-white mb-1">
              <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span class="text-xs font-bold">{{ selectedDateFormatted }}</span>
              </div>
              <svg class="w-3 h-3 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <p class="text-[10px] text-slate-400 font-medium">Recepción Hostess</p>
          </div>

          <!-- Caja Horario -->
          <div
            @click="showTimePicker = !showTimePicker; showDatePicker = false"
            class="bg-black/45 hover:bg-black/60 border border-white/15 hover:border-white/30 rounded-2xl p-3 cursor-pointer transition-all"
          >
            <div class="flex items-center justify-between text-white mb-1">
              <div class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span class="text-xs font-bold">{{ selectedTime }} hrs</span>
              </div>
              <svg class="w-3 h-3 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <p class="text-[10px] text-slate-400 font-medium">{{ selectedTime < '18:00' ? 'Turno Comida' : 'Cena Estelar VIP' }}</p>
          </div>
        </div>

        <!-- Desplegable táctil de Fechas -->
        <div v-if="showDatePicker" class="bg-black/75 border border-white/15 rounded-2xl p-2.5 grid grid-cols-4 gap-1.5 animate-fade-in">
          <button
            v-for="d in availableDates"
            :key="d.iso"
            @click="selectDate(d.iso); showDatePicker = false"
            :class="[
              'py-2 px-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer text-center',
              selectedDate === d.iso ? 'bg-amber-400 text-slate-950 font-bold shadow-md' : 'bg-white/10 text-white/80 hover:bg-white/15'
            ]"
          >
            {{ d.label }}
          </button>
        </div>

        <!-- Desplegable táctil de Horarios de Restaurante -->
        <div v-if="showTimePicker" class="bg-black/75 border border-white/15 rounded-2xl p-2.5 grid grid-cols-4 gap-1.5 animate-fade-in">
          <button
            v-for="t in ['14:00', '15:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:30']"
            :key="t"
            @click="selectedTime = t; showTimePicker = false"
            :class="[
              'py-2 px-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer text-center',
              selectedTime === t ? 'bg-amber-400 text-slate-950 font-bold shadow-md' : 'bg-white/10 text-white/80 hover:bg-white/15'
            ]"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <!-- ================= 3. NÚMERO DE COMENSALES ================= -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between px-1">
          <label class="text-[10px] uppercase tracking-wider font-bold text-slate-300/85">
            3. Número de Comensales
          </label>
          <span class="text-[11px] text-amber-400 font-semibold">Mesa para {{ guests }} personas</span>
        </div>

        <div class="grid grid-cols-6 gap-1.5">
          <button
            v-for="size in [2, 3, 4, 6, 8, 10]"
            :key="size"
            type="button"
            @click="guests = size"
            :class="[
              'py-2.5 rounded-xl text-xs font-bold transition-all border text-center cursor-pointer',
              guests === size
                ? 'bg-white text-slate-900 border-white shadow-md'
                : 'bg-black/40 text-white/80 border-white/15 hover:bg-white/10'
            ]"
          >
            {{ size }}p
          </button>
        </div>
      </div>

      <!-- ================= 4. OCASIÓN ESPECIAL / PREFERENCIA DE MESA ================= -->
      <div class="space-y-1.5">
        <label class="text-[10px] uppercase tracking-wider font-bold text-slate-300/85 block px-1">
          4. Ocasión o Preferencia (Opcional)
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="occ in occasions"
            :key="occ"
            type="button"
            @click="selectedOccasion = selectedOccasion === occ ? '' : occ"
            :class="[
              'py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer text-center',
              selectedOccasion === occ
                ? 'bg-amber-400/25 border-amber-400 text-amber-200'
                : 'bg-black/35 border-white/15 text-slate-300 hover:text-white'
            ]"
          >
            {{ occ }}
          </button>
        </div>
      </div>

      <!-- ================= 5. DATOS DEL TITULAR (PARA PASE WALLET) ================= -->
      <div class="space-y-2">
        <label class="text-[10px] uppercase tracking-wider font-bold text-slate-300/85 block px-1">
          5. Titular de la Reservación
        </label>

        <!-- Input Nombre Completo (text-base = 16px evita que iOS Safari haga auto-zoom al enfocar) -->
        <div class="relative">
          <input
            ref="nameInputRef"
            v-model="guestName"
            type="text"
            placeholder="Nombre y Apellido del Titular"
            :class="[
              'w-full bg-black/50 text-white placeholder-slate-400/60 text-base placeholder:text-xs rounded-xl px-4 py-2.5 border transition-all focus:outline-none',
              nameError ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-950/20' : 'border-white/15 focus:border-white/40'
            ]"
          />
          <span v-if="isNameValid" class="absolute right-3.5 top-3 text-emerald-400 text-xs font-bold">✓</span>
        </div>

        <!-- Input WhatsApp (text-base = 16px evita que iOS Safari haga auto-zoom al enfocar) -->
        <div class="relative flex items-center">
          <span class="absolute left-3.5 text-[11px] font-bold text-slate-300 select-none flex items-center gap-1">
            🇲🇽 +52
          </span>
          <input
            ref="phoneInputRef"
            v-model="phoneDigits"
            @input="formatPhoneInput"
            type="tel"
            maxlength="10"
            placeholder="WhatsApp (10 dígitos para envío de QR)"
            :class="[
              'w-full bg-black/50 text-white placeholder-slate-400/60 text-base placeholder:text-xs rounded-xl pl-16 pr-8 py-2.5 border transition-all focus:outline-none',
              phoneError ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-950/20' : 'border-white/15 focus:border-white/40'
            ]"
          />
          <span v-if="isPhoneValid" class="absolute right-3.5 top-3 text-emerald-400 text-xs font-bold">✓</span>
        </div>
      </div>
    </div>

    <!-- ================= FOOTER FIJO CON BOTÓN DE CONFIRMAR MESA ================= -->
    <footer class="relative z-30 px-6 py-4 pb-6 bg-gradient-to-t from-black/85 via-black/45 to-transparent rounded-b-[36px] overflow-hidden">
      <button
        @click="handleReserve"
        :disabled="isSubmitting"
        class="w-full h-14 rounded-full bg-white text-[#0F172A] font-bold text-sm shadow-[0_12px_28px_rgba(0,0,0,0.45)] hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center select-none cursor-pointer"
      >
        <span v-if="!isSubmitting">Confirmar Mesa en {{ bookingStore.selectedZone.shortName }}</span>
        <span v-else class="flex items-center gap-2 text-[#0F172A]">
          <svg class="animate-spin h-5 w-5 text-[#0F172A]" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Emitiendo Pase VIP...
        </span>
      </button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBookingStore } from '~/stores/booking'
import { EXPERIENCES, DINING_OCCASIONS } from '~/data/experiences'

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'confirmed'): void
}>()

const bookingStore = useBookingStore()
const experiences = EXPERIENCES
const occasions = DINING_OCCASIONS

// Fechas disponibles
const showDatePicker = ref(false)
const showTimePicker = ref(false)

const availableDates = computed(() => {
  const dates = []
  const today = new Date()
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  for (let i = 0; i < 8; i++) {
    const d = new Date()
    d.setDate(today.getDate() + i)
    const iso = d.toISOString().split('T')[0]
    dates.push({
      iso,
      label: i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : `${d.getDate()} ${months[d.getMonth()]}`
    })
  }
  return dates
})

const selectedDate = ref(bookingStore.date || availableDates.value[0].iso)
const selectedDateFormatted = computed(() => {
  const match = availableDates.value.find(d => d.iso === selectedDate.value)
  return match ? match.label : 'Hoy'
})

const selectDate = (iso: string) => {
  selectedDate.value = iso
  bookingStore.date = iso
}

const selectedTime = ref(bookingStore.time || '20:30')
const guests = ref(bookingStore.partySize || 2)
const selectedOccasion = ref('Cena Romántica')
const guestName = ref('')
const phoneDigits = ref('')
const isSubmitting = ref(false)

const nameInputRef = ref<HTMLInputElement | null>(null)
const phoneInputRef = ref<HTMLInputElement | null>(null)
const nameError = ref(false)
const phoneError = ref(false)

// Validación estricta
const cleanPhoneDigits = computed(() => phoneDigits.value.replace(/\D/g, ''))
const isNameValid = computed(() => guestName.value.trim().length >= 3)
const isPhoneValid = computed(() => cleanPhoneDigits.value.length === 10)

const formatPhoneInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  const raw = target.value.replace(/\D/g, '').slice(0, 10)
  phoneDigits.value = raw
  if (phoneError.value && raw.length === 10) {
    phoneError.value = false
  }
}

const handleReserve = async () => {
  if (isSubmitting.value) return

  if (!isNameValid.value) {
    nameError.value = true
    nameInputRef.value?.focus()
    setTimeout(() => { nameError.value = false }, 2500)
    return
  }

  if (!isPhoneValid.value) {
    phoneError.value = true
    phoneInputRef.value?.focus()
    setTimeout(() => { phoneError.value = false }, 2500)
    return
  }

  // Cerrar el teclado móvil antes de cambiar de vista para evitar desplazamientos o zoom residual
  nameInputRef.value?.blur()
  phoneInputRef.value?.blur()

  isSubmitting.value = true
  bookingStore.guestName = guestName.value.trim()
  bookingStore.guestPhone = `+52 ${cleanPhoneDigits.value}`
  bookingStore.partySize = guests.value
  bookingStore.date = selectedDate.value
  bookingStore.time = selectedTime.value
  bookingStore.specialRequests = selectedOccasion.value

  try {
    await bookingStore.submitReservation()
    emit('confirmed')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.18s ease-out forwards;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
