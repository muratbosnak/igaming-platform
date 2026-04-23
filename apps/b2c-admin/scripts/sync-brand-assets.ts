import { cp, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sourceDir = path.resolve(__dirname, '../../b2c-frontend/public/brands')
const targetDir = path.resolve(__dirname, '../public/brands')

async function main() {
  await mkdir(targetDir, { recursive: true })
  await cp(sourceDir, targetDir, { recursive: true, force: true })
  console.log(`[sync:brand-assets] Synced ${sourceDir} -> ${targetDir}`)
}

main().catch((error) => {
  console.error('[sync:brand-assets] Failed:', error)
  process.exit(1)
})
