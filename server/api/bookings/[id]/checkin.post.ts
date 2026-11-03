import { createError } from 'h3'
import { updateReservationStatus } from '../../../utils/firebase'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Folio requerido' })
  }

  const updated = await updateReservationStatus(id, 'SEATED')
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: `Reservación ${id} no encontrada` })
  }

  return {
    ok: true,
    reservation: updated
  }
})
