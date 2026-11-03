<template>
  <!-- Marco transparente con efecto de vidrio escarchado hiperrealista sobre el video del restaurante -->
  <div class="relative w-full flex-1 min-h-0 h-full flex flex-col justify-between rounded-[36px] border border-white/25 bg-white/[0.03] backdrop-blur-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden [clip-path:inset(0_round_36px)]">
    <!-- Resplandor ámbar ambiental suave -->
    <div class="absolute bottom-16 left-0 right-0 h-40 bg-gradient-to-t from-[#FFA726]/15 via-transparent to-transparent pointer-events-none -z-10"></div>

    <!-- Contenido del Boleto VIP que ocupa proporcionalmente el alto del canvas -->
    <div class="flex-1 min-h-0 overflow-y-auto no-scrollbar p-6 pt-5 pb-2 flex flex-col justify-between gap-3">
      <!-- Título de confirmación -->
      <div class="shrink-0">
        <h2 class="text-[28px] leading-[1.12] font-normal tracking-[-0.02em] text-white font-sans">
          Tu Pase VIP · Vespera Hub
        </h2>
      </div>

      <!-- Tarjeta Boleto Estilo Boarding Pass Glassmorphism Ultra Lujo -->
      <div class="flex-1 min-h-0 flex flex-col rounded-[28px] overflow-hidden border border-white/20 bg-black/55 backdrop-blur-xl shadow-2xl relative">
        <!-- Cabecera Fotográfica de la Zona Reservada -->
        <div class="relative h-28 shrink-0 w-full overflow-hidden border-b border-white/10">
          <img
            :src="bookingStore.selectedZone.imageUrl"
            :alt="bookingStore.selectedZone.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20"></div>
          <div class="absolute inset-0 p-3.5 flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase font-bold tracking-widest text-amber-300">
                Vespera Hub · Metepec
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                CONFIRMADA
              </span>
            </div>
            <div class="flex items-end justify-between">
              <div>
                <span class="text-xs font-bold text-white block leading-tight">{{ bookingStore.selectedZone.name }}</span>
                <span class="text-[10px] text-slate-300 block">📍 Av. Ignacio Comonfort 1500, Zona Dorada, Metepec</span>
              </div>
              <button
                @click="copyCode"
                class="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-[10px] text-white font-semibold transition-all cursor-pointer backdrop-blur-md"
              >
                {{ copied ? '¡Copiado!' : `#${reservationCode}` }}
              </button>
            </div>
          </div>
        </div>

        <!-- Cuerpo del Boleto con Detalles de la Mesa distribuido en todo el alto -->
        <div class="flex-1 p-4 flex flex-col justify-between text-xs">
          <div class="grid grid-cols-2 gap-2.5">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Titular VIP</span>
              <span class="font-bold text-white text-sm truncate block">{{ bookingStore.guestName || 'Invitado VIP' }}</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Folio deAcceso</span>
              <span class="font-black text-amber-400 text-sm font-mono block">#{{ reservationCode }}</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Fecha &amp; Horario</span>
              <span class="font-bold text-white text-xs block">{{ bookingStore.date }} • {{ bookingStore.time }} hrs</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Mesa Asignada</span>
              <span class="font-bold text-white text-xs block">{{ bookingStore.partySize }} Comensales</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Ocasión</span>
              <span class="font-medium text-amber-200 text-xs truncate block">{{ bookingStore.specialRequests || 'Cena Estelar' }}</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block">Dress Code</span>
              <span class="font-medium text-slate-200 text-xs block">{{ bookingStore.selectedZone.dressCode }}</span>
            </div>
          </div>

          <!-- Línea perforada de boleto con muescas laterales -->
          <div class="relative py-1.5 flex items-center justify-center">
            <div class="absolute -left-6 w-4 h-4 rounded-full bg-[#121B21]"></div>
            <div class="border-t border-dashed border-white/20 w-full"></div>
            <div class="absolute -right-6 w-4 h-4 rounded-full bg-[#121B21]"></div>
          </div>

          <!-- QR Code para Recepción Hostess -->
          <div class="flex items-center justify-between pt-0.5">
            <div>
              <span class="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">Recepción Hostess &amp; Valet</span>
              <p class="text-[11px] text-slate-300/85 leading-snug">
                Muestra este código QR al llegar a recepción. Tolerancia de mesa: 15 minutos.
              </p>
            </div>

            <!-- Matriz QR simulada con SVG nítido -->
            <div class="w-14 h-14 bg-white p-1 rounded-xl shadow-lg shrink-0 flex items-center justify-center ml-3">
              <svg class="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h-4v2h2v4h4v-2h-2v-4zm-4 4h2v2h-2v-2zm8-2h-2v-2h2v2zm0 4h-2v2h2v-2zm-6-2h2v2h-2v-2zm-4-6h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm0 4h2v2h-2v-2zm-4-2h2v2h-2v-2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de Cómo Llegar (Google Maps, Waze, Apple Maps) en la pantalla de confirmación -->
      <div class="space-y-1.5 shrink-0">
        <span class="text-[10px] uppercase tracking-wider font-bold text-slate-300/85 block px-1">
          Cómo Llegar a Vespera Hub Metepec
        </span>
        <div class="grid grid-cols-3 gap-2">
          <!-- Google Maps -->
          <a
            href="https://www.google.com/maps/search/?api=1&query=Av.+Ignacio+Comonfort+1500,+Metepec,+Estado+de+Mexico"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-black/50 hover:bg-white/15 border border-white/15 hover:border-amber-400/60 transition-all cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span class="text-[11px] font-bold text-white leading-tight">Maps</span>
          </a>

          <!-- Waze -->
          <a
            href="https://waze.com/ul?q=Av.%20Ignacio%20Comonfort%201500%20Metepec&ll=19.2618,-99.6052&navigate=yes"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-black/50 hover:bg-white/15 border border-white/15 hover:border-sky-400/60 transition-all cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            <span class="text-[11px] font-bold text-white leading-tight">Waze</span>
          </a>

          <!-- Apple Maps -->
          <a
            href="https://maps.apple.com/?q=Vespera+Hub+Metepec&address=Av.+Ignacio+Comonfort+1500,+Metepec,+Estado+de+Mexico&ll=19.2618,-99.6052"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-black/50 hover:bg-white/15 border border-white/15 hover:border-white/50 transition-all cursor-pointer"
          >
            <svg class="w-3.5 h-3.5 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
            <span class="text-[11px] font-bold text-white leading-tight">Apple</span>
          </a>
        </div>
      </div>
    </div>

    <!-- ================= FOOTER FIJO CON BOTONES DE WALLET ================= -->
    <footer class="relative z-20 px-6 py-4 pb-6 bg-gradient-to-t from-black/85 via-black/45 to-transparent space-y-2.5 rounded-b-[36px] overflow-hidden">
      <!-- Google Wallet (Activo con Issuer ID 3388000000023217768) -->
      <a
        :href="googleWalletUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="w-full h-12 rounded-2xl bg-white text-[#1E293B] hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer px-4 select-none"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <div class="text-left leading-tight">
          <span class="text-[8px] uppercase tracking-wider block text-slate-500 font-semibold">Guardar Pase en</span>
          <span class="text-xs font-bold tracking-tight block text-[#1E293B]">Google Wallet</span>
        </div>
      </a>

      <!-- Apple Wallet -->
      <a
        :href="applePassUrl"
        class="w-full h-12 rounded-2xl bg-black text-white border border-white/25 hover:border-white/50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer px-4 select-none"
      >
        <svg class="w-5 h-5 fill-current" viewBox="0 0 170 170">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.33-6.19-9.35-10.98-19.8-14.37-31.34-3.39-11.54-5.09-22.39-5.09-32.55 0-14.59 3.59-26.69 10.77-36.31 7.18-9.61 16.27-14.57 27.27-14.88 4.58 0 9.87 1.25 15.86 3.75 6 2.5 10.15 3.8 12.45 3.9 1.9.1 6.16-1.28 12.78-4.14 6.63-2.87 12.28-4.18 16.97-3.94 12.63.63 22.84 5.34 30.62 14.13-11.04 6.69-16.42 16.03-16.14 28.02.28 9.5 4.04 17.5 11.28 24 7.24 6.5 15.83 10.16 25.77 10.98-2.22 6.84-4.88 13.43-7.98 19.78zm-29.47-111.45c0 7.37-2.73 14.28-8.19 20.73-6.57 7.76-14.4 12.33-23.49 13.71-.34-1.42-.51-2.82-.51-4.2 0-7.1 2.94-14.22 8.82-21.36 2.94-3.57 6.61-6.52 11.01-8.86 4.4-2.33 8.52-3.57 12.36-3.72v3.7z"/>
        </svg>
        <div class="text-left leading-tight">
          <span class="text-[8px] uppercase tracking-wider block text-white/70">Añadir a</span>
          <span class="text-xs font-bold tracking-tight block">Apple Wallet</span>
        </div>
      </a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useBookingStore } from '~/stores/booking'

defineEmits<{
  (e: 'reset'): void
}>()

const bookingStore = useBookingStore()
const runtimeConfig = useRuntimeConfig()
const copied = ref(false)
const directGoogleSaveUrl = ref('')

const reservationCode = computed(() => {
  return bookingStore.confirmedReservation?.id || 'VH-4821'
})

function base64UrlEncode(input: string | Uint8Array): string {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function generateClientGoogleWalletUrl() {
  if (!import.meta.client || !window.crypto?.subtle) return
  const issuerId = runtimeConfig.public.googleWalletIssuerId || '3388000000023217768'
  const classSuffix = runtimeConfig.public.googleWalletClassId || 'vesperahub_vip_pass'
  const clientEmail = runtimeConfig.public.googleWalletClientEmail
  const privateKeyPem = runtimeConfig.public.googleWalletPrivateKey?.replace(/\\n/g, '\n')

  if (!issuerId || !clientEmail || !privateKeyPem) return

  try {
    const pemContents = privateKeyPem
      .replace(/-----BEGIN PRIVATE KEY-----/, '')
      .replace(/-----END PRIVATE KEY-----/, '')
      .replace(/\s+/g, '')
    const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0))

    const cryptoKey = await window.crypto.subtle.importKey(
      'pkcs8',
      binaryDer.buffer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const serialNumber = reservationCode.value.replace(/^#/, '')
    const objectId = `${issuerId}.${serialNumber.replace(/[^a-zA-Z0-9_.-]/g, '_')}`
    const classId = `${issuerId}.${classSuffix}`

    const header = { alg: 'RS256', typ: 'JWT' }
    const claims = {
      iss: clientEmail,
      aud: 'google',
      origins: [],
      typ: 'savetowallet',
      payload: {
        genericClasses: [{ id: classId }],
        genericObjects: [
          {
            id: objectId,
            classId,
            genericType: 'GENERIC_TYPE_UNSPECIFIED',
            hexBackgroundColor: '#121B21',
            cardTitle: { defaultValue: { language: 'es-MX', value: 'Vespera Hub VIP Pass' } },
            subheader: { defaultValue: { language: 'es-MX', value: `${bookingStore.selectedZone.shortName} · Metepec` } },
            header: { defaultValue: { language: 'es-MX', value: bookingStore.guestName || 'Invitado VIP' } },
            barcode: {
              type: 'QR_CODE',
              value: serialNumber,
              alternateText: `#${serialNumber}`
            },
            textModulesData: [
              { id: 'datetime', header: 'FECHA Y HORARIO', body: `${bookingStore.date} • ${bookingStore.time} hrs` },
              { id: 'guests', header: 'COMENSALES', body: `${bookingStore.partySize} personas` }
            ]
          }
        ]
      }
    }

    const signingInput = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(claims))}`
    const signature = await window.crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      new TextEncoder().encode(signingInput)
    )
    const jwtToken = `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`
    directGoogleSaveUrl.value = `https://pay.google.com/gp/v/save/${jwtToken}`
  } catch {
    // Fallback to API endpoint
  }
}

onMounted(() => {
  generateClientGoogleWalletUrl()
})

watch(reservationCode, () => {
  generateClientGoogleWalletUrl()
})

const applePassUrl = computed(() => {
  const params = new URLSearchParams({
    guestName: bookingStore.guestName || 'Invitado VIP',
    guestPhone: bookingStore.guestPhone || '+52 55 1234 5678',
    date: bookingStore.date || '',
    time: bookingStore.time || '20:30',
    partySize: String(bookingStore.partySize || 2),
    zoneId: bookingStore.selectedZoneId
  })
  return `/api/wallet/apple/${reservationCode.value}?${params.toString()}`
})

const googleWalletUrl = computed(() => {
  if (directGoogleSaveUrl.value) return directGoogleSaveUrl.value
  const params = new URLSearchParams({
    guestName: bookingStore.guestName || 'Invitado VIP',
    date: bookingStore.date || '',
    time: bookingStore.time || '20:30',
    partySize: String(bookingStore.partySize || 2),
    zoneId: bookingStore.selectedZoneId
  })
  return `/api/wallet/google/${reservationCode.value}?${params.toString()}`
})

const copyCode = async () => {
  if (import.meta.client && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(`#${reservationCode.value}`)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    } catch {
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }
  }
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
