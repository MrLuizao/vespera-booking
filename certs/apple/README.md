# Certificados de Apple Wallet (`passkit-generator`)

Coloca aquí los 3 archivos `.pem` generados desde tu cuenta de **Apple Developer**:

1. `wwdr.pem` — Certificado intermedio **Apple Worldwide Developer Relations (G4)**.
   Puedes descargarlo y convertirlo con un solo comando en tu terminal:
   ```bash
   curl -s https://www.apple.com/certificateauthority/AppleWWDRCAG4.cer | openssl x509 -inform DER -out certs/apple/wwdr.pem
   ```
2. `signerCert.pem` — Certificado de tu **Pass Type ID** (`pass.cer` descargado desde Apple Developer Portal):
   ```bash
   openssl x509 -inform DER -in pass.cer -out certs/apple/signerCert.pem
   ```
3. `signerKey.pem` — Llave privada exportada desde **Acceso a Llaveros (Keychain Access)** como `.p12`:
   ```bash
   openssl pkcs12 -in Certificates.p12 -nocerts -out certs/apple/signerKey.pem -legacy
   ```

En cuanto estos 3 archivos existan en `certs/apple/`, el endpoint `/api/wallet/apple/[id]` firmará automáticamente paquetes `.pkpass` reales para iPhone y Apple Watch.
