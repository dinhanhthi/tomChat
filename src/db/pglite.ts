import { PGliteWorker } from '@electric-sql/pglite/worker'
import { drizzle } from 'drizzle-orm/pglite'

// function initializeDatabase() {
//   const client = new PGliteWorker(new Worker(new URL('./pglite.worker.ts', import.meta.url)))
//   const db = drizzle({ client: client as any })
//   return db
// }

const client = new PGliteWorker(new Worker(new URL('./pglite.worker.ts', import.meta.url)))
const db = drizzle({ client: client as any })

export default db
