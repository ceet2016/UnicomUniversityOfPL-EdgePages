// Manual, guaranteed upload of the SPA shell into Blob.
//
// Use this if the automatic `postbuild` upload did not work in the Makers build
// environment (e.g. no Blob credentials were injected at build time). After a
// successful `npm run build`, set your Makers API credentials and run:
//
//   EO_PROJECT_ID=pages-xxxxxxxx  EO_TOKEN=your-api-token  npm run sync-index
//
// Get the project ID and API Token from the EdgeOne Makers console
// (Project Settings -> API Token / Storage).

import { readFileSync } from 'node:fs'
import { getStore } from '@edgeone/pages-blob'

const projectId = process.env.EO_PROJECT_ID
const token = process.env.EO_TOKEN

if (!projectId || !token) {
  console.error('缺少环境变量：请设置 EO_PROJECT_ID 和 EO_TOKEN（在 Makers 控制台获取 API Token）')
  process.exit(1)
}

const indexPath = new URL('../dist/index.html', import.meta.url)
let html
try {
  html = readFileSync(indexPath, 'utf-8')
} catch (e) {
  console.error('dist/index.html 不存在，请先执行 `npm run build`。')
  process.exit(1)
}

const store = getStore({ name: 'spa-shell', projectId, token })
await store.set('index.html', html)
console.log('OK: dist/index.html -> Blob namespace "spa-shell" (key: index.html)')
