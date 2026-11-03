import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import jwt from 'jsonwebtoken'
import { sendRedirect } from 'h3'
import { getReservationRecord } from '../../../utils/firebase'

function getServiceAccountCredentials(): { clientEmail?: string; privateKey?: string } {
  const envEmail = process.env.GOOGLE_WALLET_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL
  const envKey = (process.env.GOOGLE_WALLET_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY)?.replace(/\\n/g, '\n')
  if (envEmail && envKey) {
    return { clientEmail: envEmail, privateKey: envKey }
  }

  try {
    const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
      ? resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
      : resolve(process.cwd(), 'firebase-service-account.json')

    if (existsSync(saPath)) {
      const sa = JSON.parse(readFileSync(saPath, 'utf-8'))
      return {
        clientEmail: sa.client_email,
        privateKey: sa.private_key
      }
    }
  } catch {
    // Fallback below
  }

  return {}
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || 'VH-4821'
  const query = getQuery(event)

  const stored = await getReservationRecord(id)
  const guestName = stored?.guestName || (query.guestName as string) || 'VIP Guest'
  const date = stored?.date || (query.date as string) || new Date().toISOString().split('T')[0]
  const time = stored?.time || (query.time as string) || '20:00'
  const partySize = stored?.partySize || Number(query.partySize) || 2
  const zoneId = stored?.zoneId || (query.zoneId as string) || 'salon-principal'
  const serialNumber = (stored?.id || id).replace(/^#/, '')

  const zoneNames: Record<string, string> = {
    'salon-principal': 'Salón Imperial · Metepec',
    terraza: 'Terraza & Fire Pit · Metepec',
    cava: 'La Cava Privada · Metepec'
  }
  const zoneLabel = zoneNames[zoneId] || 'Salón Imperial · Metepec'

  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || '3388000000023217768'
  const classSuffix = process.env.GOOGLE_WALLET_CLASS_ID || 'vesperahub_vip_pass'
  const { clientEmail, privateKey } = getServiceAccountCredentials()

  if (issuerId && clientEmail && privateKey) {
    const objectId = `${issuerId}.${serialNumber.replace(/[^a-zA-Z0-9_.-]/g, '_')}`
    const classId = `${issuerId}.${classSuffix}`

    const genericClass = {
      id: classId
    }

    const genericObject = {
      id: objectId,
      classId,
      genericType: 'GENERIC_TYPE_UNSPECIFIED',
      hexBackgroundColor: '#121B21',
      cardTitle: {
        defaultValue: { language: 'es-MX', value: 'Vespera Hub VIP Pass' }
      },
      subheader: {
        defaultValue: { language: 'es-MX', value: zoneLabel }
      },
      header: {
        defaultValue: { language: 'es-MX', value: guestName }
      },
      barcode: {
        type: 'QR_CODE',
        value: serialNumber,
        alternateText: `#${serialNumber}`
      },
      textModulesData: [
        {
          id: 'datetime',
          header: 'FECHA Y HORARIO',
          body: `${date} • ${time} hrs`
        },
        {
          id: 'guests',
          header: 'HUÉSPEDES',
          body: `${partySize} personas`
        }
      ]
    }

    const claims = {
      iss: clientEmail,
      aud: 'google',
      origins: [],
      typ: 'savetowallet',
      payload: {
        genericClasses: [genericClass],
        genericObjects: [genericObject]
      }
    }

    const token = jwt.sign(claims, privateKey, { algorithm: 'RS256' })
    return sendRedirect(event, `https://pay.google.com/gp/v/save/${token}`, 302)
  }

  return {
    readyToSign: false,
    message: 'Configura GOOGLE_WALLET_ISSUER_ID en .env para activar el redireccionamiento firmado RS256 a Google Wallet.',
    serviceAccountReady: Boolean(clientEmail && privateKey),
    serviceAccountEmail: clientEmail || null,
    reservationFromDb: stored
  }
})
