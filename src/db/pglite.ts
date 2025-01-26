import { PGliteWorker } from '@electric-sql/pglite/worker'
import { drizzle } from 'drizzle-orm/pglite'
import { models } from './schema'

async function initializeDatabase() {
  const client = new PGliteWorker(new Worker(new URL('./pglite.worker.ts', import.meta.url)))
  const db = drizzle({ client: client as any })
  return db
}

export { initializeDatabase, models }
