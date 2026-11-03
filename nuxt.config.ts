import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

let saEmail = process.env.GOOGLE_WALLET_CLIENT_EMAIL || ''
let saKey = process.env.GOOGLE_WALLET_PRIVATE_KEY || ''

try {
  const saPath = resolve(process.cwd(), 'firebase-service-account.json')
  if (existsSync(saPath)) {
    const sa = JSON.parse(readFileSync(saPath, 'utf-8'))
    saEmail = sa.client_email || saEmail
    saKey = sa.private_key || saKey
  }
} catch {
  // Ignore if not present
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  tailwindcss: {
    cssPath: '~/assets/css/main.css'
  },
  runtimeConfig: {
    public: {
      googleWalletIssuerId: process.env.GOOGLE_WALLET_ISSUER_ID || '3388000000023217768',
      googleWalletClassId: process.env.GOOGLE_WALLET_CLASS_ID || 'vesperahub_vip_pass',
      googleWalletClientEmail: saEmail,
      googleWalletPrivateKey: saKey
    }
  }
})
