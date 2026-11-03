import { defineStore } from 'pinia'
import type { WebReservationPayload, StoredReservation } from '~/types/booking'
import { EXPERIENCES, type ExperienceZone } from '~/data/experiences'

export type BookingStep = 'discovery' | 'detail' | 'confirmation'

export const useBookingStore = defineStore('booking', () => {
  // Navigation
  const currentStep = ref<BookingStep>('discovery')

  // Selected Experience (Por defecto Salón Principal con el video de Alta Cocina / Chef)
  const selectedZoneId = ref<'terraza' | 'cava' | 'salon-principal'>('salon-principal')
  const customVideoUrl = ref<string>('')
  const selectedZone = computed<ExperienceZone>(() => {
    return EXPERIENCES.find(e => e.id === selectedZoneId.value) || EXPERIENCES[0]
  })

  // Booking Form State
  const guestName = ref('')
  const guestPhone = ref('')
  const partySize = ref(2)
  const date = ref(new Date().toISOString().split('T')[0])
  const time = ref('20:00')
  const specialRequests = ref('')
  const utmSource = ref<'INSTAGRAM' | 'GOOGLE_MAPS' | 'DIRECT'>('DIRECT')

  // Processing state
  const isSubmitting = ref(false)
  const confirmedReservation = ref<StoredReservation | null>(null)

  // Initialize guest session from localStorage and UTM parameters from URL
  function initSession(routeQuery?: Record<string, any>) {
    if (import.meta.client) {
      // UTM capture (direct from URL search params or passed object)
      let utm = routeQuery?.utm_source?.toString().toUpperCase()
      if (!utm && typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        utm = params.get('utm_source')?.toUpperCase()
      }

      if (utm === 'INSTAGRAM' || utm === 'GOOGLE_MAPS') {
        utmSource.value = utm
      } else if (utm) {
        utmSource.value = utm.includes('INSTA') ? 'INSTAGRAM' : utm.includes('MAP') ? 'GOOGLE_MAPS' : 'DIRECT'
      }

      // No prellenar datos automáticamente, mantener vacíos
      guestName.value = ''
      guestPhone.value = ''
    }
  }

  function selectZone(zoneId: 'terraza' | 'cava' | 'salon-principal') {
    selectedZoneId.value = zoneId
    currentStep.value = 'detail'
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function goBackToDiscovery() {
    currentStep.value = 'discovery'
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function saveToFirestoreRestFallback(reservation: StoredReservation) {
    if (!import.meta.client || !window.crypto?.subtle) return
    const runtimeConfig = useRuntimeConfig()
    const clientEmail = runtimeConfig.public.googleWalletClientEmail
    const privateKeyPem = runtimeConfig.public.googleWalletPrivateKey?.replace(/\\n/g, '\n')
    if (!clientEmail || !privateKeyPem) return

    try {
      const b64u = (input: string | Uint8Array) => {
        const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input
        let bin = ''
        for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i])
        return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
      }

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

      const now = Math.floor(Date.now() / 1000)
      const header = { alg: 'RS256', typ: 'JWT' }
      const claim = {
        iss: clientEmail,
        scope: 'https://www.googleapis.com/auth/datastore',
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600
      }
      const signingInput = `${b64u(JSON.stringify(header))}.${b64u(JSON.stringify(claim))}`
      const sig = await window.crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, new TextEncoder().encode(signingInput))
      const assertion = `${signingInput}.${b64u(new Uint8Array(sig))}`

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion
        })
      })
      const tokenData = await tokenRes.json()
      if (!tokenData.access_token) return

      await fetch(
        `https://firestore.googleapis.com/v1/projects/booking-project-6d692/databases/(default)/documents/reservations/${reservation.id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: {
              id: { stringValue: reservation.id },
              restaurantId: { stringValue: reservation.restaurantId },
              zoneId: { stringValue: reservation.zoneId },
              guestName: { stringValue: reservation.guestName },
              guestPhone: { stringValue: reservation.guestPhone },
              partySize: { integerValue: String(reservation.partySize) },
              date: { stringValue: reservation.date },
              time: { stringValue: reservation.time },
              specialRequests: { stringValue: reservation.specialRequests || '' },
              status: { stringValue: reservation.status },
              createdAt: { stringValue: reservation.createdAt }
            }
          })
        }
      )
    } catch {
      // Ignore if offline
    }
  }

  async function submitReservation(): Promise<StoredReservation> {
    isSubmitting.value = true

    // Generate Short Booking ID (e.g. VH-8942)
    const randomCode = Math.floor(1000 + Math.random() * 9000)
    const bookingId = `VH-${randomCode}`

    const payload: WebReservationPayload = {
      restaurantId: 'vespera-hub-metepec',
      zoneId: selectedZoneId.value,
      guestName: guestName.value.trim() || 'VIP Guest',
      guestPhone: guestPhone.value.trim() || '+52 55 0000 0000',
      partySize: partySize.value,
      date: date.value,
      time: time.value,
      specialRequests: specialRequests.value.trim(),
      source: utmSource.value,
      userAgent: import.meta.client ? navigator.userAgent : 'Mobile-Web'
    }

    try {
      // Direct call to local API or generate reservation
      let reservation: StoredReservation
      try {
        reservation = await $fetch<StoredReservation>('/api/bookings', {
          method: 'POST',
          body: payload
        })
      } catch {
        // Fallback para Firebase Hosting estático (guarda directo en Cloud Firestore REST API)
        reservation = {
          ...payload,
          id: bookingId,
          status: 'CONFIRMED',
          applePassUrl: `/api/wallet/apple/${bookingId}`,
          googleWalletUrl: `/api/wallet/google/${bookingId}`,
          createdAt: new Date().toISOString()
        }
        await saveToFirestoreRestFallback(reservation)
      }

      confirmedReservation.value = reservation

      // Save guest session for 0-friction future visits
      if (import.meta.client) {
        localStorage.setItem('gastro_guest_name', payload.guestName)
        localStorage.setItem('gastro_guest_phone', payload.guestPhone)
      }

      currentStep.value = 'confirmation'
      if (import.meta.client) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return reservation
    } finally {
      isSubmitting.value = false
    }
  }

  function resetToNewBooking() {
    confirmedReservation.value = null
    currentStep.value = 'discovery'
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return {
    currentStep,
    selectedZoneId,
    customVideoUrl,
    selectedZone,
    guestName,
    guestPhone,
    partySize,
    date,
    time,
    specialRequests,
    utmSource,
    isSubmitting,
    confirmedReservation,
    initSession,
    selectZone,
    goBackToDiscovery,
    submitReservation,
    resetToNewBooking
  }
})
