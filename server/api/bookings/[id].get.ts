import { createError } from 'h3'
import { getReservationRecord, isFirebaseConnected } from '../../utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Folio de reservación requerido' })
  }

  const reservation = await getReservationRecord(id)
  if (!reservation) {
    throw createError({ statusCode: 404, statusMessage: `Reservación ${id} no encontrada` })
  }

  return {
    reservation,
    provider: isFirebaseConnected() ? 'CLOUD_FIRESTORE' : 'LOCAL_JSON_FALLBACK'
  }
})
