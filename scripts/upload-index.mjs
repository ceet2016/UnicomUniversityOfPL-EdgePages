// Upload the built SPA entry (dist/index.html) into EdgeOne Blob storage so the
// Makers catch-all function can serve it for legacy history-mode deep links
// WITHOUT any self-fetch loop. The catch-all reads the bundled copy first (via
// edgeone.json `cloudFunctions.includeFiles`), and falls back to Blob.
//
// Runs automatically as the `postbuild` npm script. It is best-effort: if Blob
// credentials are unavailable in the build environment, it logs a warning and
// exits 0 so the build never fails. In that case, run `npm run sync-index`
// locally with EO_PROJECT_ID + EO_TOKEN to push the shell manually.

import { readFileSync } from 'node:fs'
import { getStore } from '@edgeone/pages-blob'

const indexPath = new URL('../dist/index.html', import.meta.url)

async function main() {
  let html
  try {
    html = readFileSync(indexPath, 'utf-8')
  } catch (e) {
    console.warn('[upload-index] dist/index.html not found — run `npm run build` first. Skipping.')
    return
  }

  try {
    const store = getStore('spa-shell')
    await store.set('index.html', html)
    console.log('[upload-index] OK: dist/index.html -> Blob namespace "spa-shell" (key: index.html)')
  } catch (e) {
    console.warn('[upload-index] WARN: could not upload to Blob:', e.message)
    console.warn('[upload-index] SPA shell will rely on the bundled includeFiles copy. If legacy')
    console.warn('[upload-index] history-mode deep links return errors, run `npm run sync-index`.')
  }
}

main().then(() => process.exit(0)).catch(() => process.exit(0))
