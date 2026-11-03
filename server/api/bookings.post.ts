import type { WebReservationPayload, StoredReservation } from '~/types/booking'
import { saveReservationRecord } from '../utils/firebase'

export default defineEventHandler(async (event) => {
  const body = await readBody<WebReservationPayload>(event)

  const randomCode = Math.floor(1000 + Math.random() * 9000)
  const id = `VH-${randomCode}`

  const reservation: StoredReservation = {
    ...body,
    id,
    status: 'CONFIRMED',
    applePassUrl: `/api/wallet/apple/${id}`,
    googleWalletUrl: `/api/wallet/google/${id}`,
    createdAt: new Date().toISOString()
  }

  await saveReservationRecord(reservation)

  return reservation
})
