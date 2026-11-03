import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { PKPass } from 'passkit-generator'
import { getReservationRecord } from '../../../utils/firebase'

// PNG transparente válido requerido por iOS PassKit para icon.png y logo.png
const MINIMAL_ICON_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAA9SURBVHja7cExAQAAAMKg9U9tCU+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4GECAAAEv6Z9JAAAAAElFTkSuQmCC',
  'base64'
)

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || 'VH-4821'
  const query = getQuery(event)

  // 1. Consultar la reserva real desde Cloud Firestore (o respaldo local)
  const stored = await getReservationRecord(id)

  const guestName = stored?.guestName || (query.guestName as string) || 'VIP Guest'
  const guestPhone = stored?.guestPhone || (query.guestPhone as string) || '+52 55 0000 0000'
  const date = stored?.date || (query.date as string) || new Date().toISOString().split('T')[0]
  const time = stored?.time || (query.time as string) || '20:00'
  const partySize = stored?.partySize || Number(query.partySize) || 2
  const serialNumber = stored?.id || id

  const certsDir = resolve(process.cwd(), process.env.APPLE_PASS_CERTS_DIR || './certs/apple')
  const wwdrPath = resolve(certsDir, 'wwdr.pem')
  const signerCertPath = resolve(certsDir, 'signerCert.pem')
  const signerKeyPath = resolve(certsDir, 'signerKey.pem')

  const hasRealCerts =
    existsSync(wwdrPath) &&
    existsSync(signerCertPath) &&
    existsSync(signerKeyPath)

  const passJson = {
    formatVersion: 1 as const,
    passTypeIdentifier: process.env.APPLE_PASS_TYPE_IDENTIFIER || 'pass.mx.vesperahub.vip',
    teamIdentifier: process.env.APPLE_PASS_TEAM_ID || 'TEAMID0000',
    organizationName: process.env.APPLE_PASS_ORGANIZATION_NAME || 'Vespera Hub',
    description: `Pase VIP Vespera Hub #${serialNumber}`,
    serialNumber,
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(18, 27, 33)',
    labelColor: 'rgb(255, 179, 71)',
    logoText: 'Vespera Hub',
    barcodes: [
      {
        format: 'PKBarcodeFormatQR' as const,
        message: `https://vesperahub.mx/checkin/${serialNumber}`,
        messageEncoding: 'iso-8859-1',
        altText: `#${serialNumber}`
      }
    ],
    eventTicket: {
      headerFields: [
        {
          key: 'code',
          label: 'FOLIO',
          value: `#${serialNumber}`
        }
      ],
      primaryFields: [
        {
          key: 'guest',
          label: 'TITULAR VIP',
          value: guestName
        }
      ],
      secondaryFields: [
        {
          key: 'date',
          label: 'FECHA',
          value: date
        },
        {
          key: 'time',
          label: 'HORARIO',
          value: `${time} HRS`
        },
        {
          key: 'guests',
          label: 'HUÉSPEDES',
          value: `${partySize}–${partySize + 1} personas`
        }
      ],
      auxiliaryFields: [
        {
          key: 'phone',
          label: 'WHATSAPP',
          value: guestPhone
        },
        {
          key: 'status',
          label: 'ESTATUS',
          value: stored?.status || 'CONFIRMED'
        }
      ]
    }
  }

  // 2. Si están los 3 certificados en ./certs/apple/, firma y genera el .pkpass real
  if (hasRealCerts) {
    const pass = new PKPass(
      {
        'pass.json': Buffer.from(JSON.stringify(passJson)),
        'icon.png': MINIMAL_ICON_PNG,
        'icon@2x.png': MINIMAL_ICON_PNG,
        'logo.png': MINIMAL_ICON_PNG,
        'logo@2x.png': MINIMAL_ICON_PNG
      },
      {
        wwdr: readFileSync(wwdrPath),
        signerCert: readFileSync(signerCertPath),
        signerKey: readFileSync(signerKeyPath),
        signerKeyPassphrase: process.env.APPLE_PASS_KEY_PASSPHRASE || undefined
      }
    )

    const buffer = pass.getAsBuffer()

    setResponseHeaders(event, {
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': `inline; filename="vesperahub-${serialNumber}.pkpass"`,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    })

    return buffer
  }

  // 3. Modo diagnóstico o vista previa
  if (query.debug === '1') {
    return {
      readyToSign: false,
      message: 'Falta signerCert.pem en ./certs/apple/ (wwdr.pem y signerKey.pem ya están listos)',
      reservationFromDb: stored,
      passPreview: passJson
    }
  }

  setResponseHeaders(event, {
    'Content-Type': 'application/vnd.apple.pkpass',
    'Content-Disposition': `inline; filename="vesperahub-${serialNumber}.pkpass"`,
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  })

  return Buffer.from(JSON.stringify(passJson, null, 2))
})
