import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import type { StoredReservation } from '~/types/booking'

let firebaseApp: App | null = null
let firestoreDb: Firestore | null = null

const LOCAL_DB_DIR = resolve(process.cwd(), '.data')
const LOCAL_DB_FILE = resolve(LOCAL_DB_DIR, 'reservations.json')

/**
 * Inicializa Firebase Admin (Cloud Firestore) si existen credenciales en .env
 * o un archivo serviceAccountKey.json en la raíz del proyecto.
 */
export function getFirestoreDb(): Firestore | null {
  if (firestoreDb) return firestoreDb

  try {
    const existingApps = getApps()
    if (existingApps.length > 0) {
      firebaseApp = existingApps[0]
      firestoreDb = getFirestore(firebaseApp)
      return firestoreDb
    }

    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
      ? resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
      : resolve(process.cwd(), 'firebase-service-account.json')

    if (existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
      firebaseApp = initializeApp({
        credential: cert(serviceAccount)
      })
      firestoreDb = getFirestore(firebaseApp)
      return firestoreDb
    }

    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (projectId && clientEmail && privateKey) {
      firebaseApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey
        })
      })
      firestoreDb = getFirestore(firebaseApp)
      return firestoreDb
    }
  } catch (err) {
    console.warn('[Firebase] Usando respaldo local (.data/reservations.json):', (err as Error).message)
  }

  return null
}

export function isFirebaseConnected(): boolean {
  return getFirestoreDb() !== null
}

function readLocalReservations(): Record<string, StoredReservation> {
  try {
    if (!existsSync(LOCAL_DB_FILE)) return {}
    const raw = readFileSync(LOCAL_DB_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function writeLocalReservation(reservation: StoredReservation) {
  try {
    if (!existsSync(LOCAL_DB_DIR)) {
      mkdirSync(LOCAL_DB_DIR, { recursive: true })
    }
    const current = readLocalReservations()
    current[reservation.id] = reservation
    writeFileSync(LOCAL_DB_FILE, JSON.stringify(current, null, 2), 'utf-8')
  } catch (err) {
    console.warn('[LocalDB] No se pudo escribir respaldo local:', (err as Error).message)
  }
}

/**
 * Guarda una reservación en Cloud Firestore (colección `reservations`)
 * y mantiene copia en `.data/reservations.json` para desarrollo local sin fricción.
 */
export async function saveReservationRecord(reservation: StoredReservation): Promise<StoredReservation> {
  writeLocalReservation(reservation)

  const db = getFirestoreDb()
  if (db) {
    try {
      await db
        .collection('reservations')
        .doc(reservation.id)
        .set({
          ...reservation,
          updatedAt: new Date().toISOString()
        }, { merge: true })
    } catch (err) {
      console.warn('[Firestore] Usando copia local mientras se activa Firestore Database:', (err as Error).message)
    }
  }

  return reservation
}

/**
 * Obtiene una reservación por su folio (ej. `WN-4821`) desde Cloud Firestore
 * o desde el respaldo local si aún no se han configurado credenciales.
 */
export async function getReservationRecord(id: string): Promise<StoredReservation | null> {
  const cleanId = id.replace(/^#/, '').trim().toUpperCase()

  const db = getFirestoreDb()
  if (db) {
    try {
      const snap = await db.collection('reservations').doc(cleanId).get()
      if (snap.exists) {
        return snap.data() as StoredReservation
      }
    } catch (err) {
      console.warn('[Firestore] Leyendo copia local mientras se activa Firestore Database:', (err as Error).message)
    }
  }

  const local = readLocalReservations()
  return local[cleanId] || null
}

/**
 * Actualiza el estatus de una reservación (ej. cuando la Hostess escanea el QR del Wallet)
 */
export async function updateReservationStatus(
  id: string,
  status: 'CONFIRMED' | 'SEATED' | 'CANCELLED'
): Promise<StoredReservation | null> {
  const existing = await getReservationRecord(id)
  if (!existing) return null

  const updated: StoredReservation = {
    ...existing,
    status
  }

  await saveReservationRecord(updated)
  return updated
}
