import { PGliteWorker } from '@electric-sql/pglite/worker'
import { PgDialect } from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/pglite'
import { IDB_NAME } from '../lib/constants'
import migrations from './migrations/export.json'
import * as schema from './schema'

export async function initializeDb() {
  const client = new PGliteWorker(new Worker(new URL('./pglite.worker.ts', import.meta.url)))
  const _db = drizzle({ client: client as any })

  let isLocalDBSchemaSynced = false

  if (!isLocalDBSchemaSynced) {
    const start = performance.now()
    try {
      await new PgDialect().migrate(migrations, _db._.session as any, IDB_NAME)
      isLocalDBSchemaSynced = true
      console.info(`✅ Local database ready in ${performance.now() - start}ms`)
    } catch (error) {
      console.error(`❌ Local database failed to sync: ${error}`)
    }
  }

  const db = Object.assign(_db, {
    schema
  })

  return db
}
