import { live } from '@electric-sql/pglite/live'
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { PgDialect } from 'drizzle-orm/pg-core'
import { drizzle, PgliteDatabase } from 'drizzle-orm/pglite'
import { IDB_NAME } from '../lib/constants'
import migrations from './migrations/export.json'
import * as schema from './schema'

export type DbType = PgliteDatabase<Record<string, never>> & {
  $client: any
} & {
  schema: typeof schema
}

export async function initializeDb() {
  const pg = await PGliteWorker.create(
    new Worker(new URL('./pglite.worker.ts', import.meta.url), {
      type: 'module'
    }),
    {
      extensions: {
        live
      }
    }
  )

  const _db = drizzle({ client: pg as any })

  let isLocalDBSchemaSynced = false

  if (!isLocalDBSchemaSynced) {
    const start = performance.now()
    try {
      await new PgDialect().migrate(migrations, _db._.session as any, IDB_NAME)
      const runtime = performance.now() - start
      isLocalDBSchemaSynced = true
      console.info(`✅ Local database ready in ${parseFloat(runtime.toFixed(2))}ms`)
    } catch (error) {
      console.error(`❌ Local database failed to sync: ${error}`)
    }
  }

  const db = Object.assign(_db, {
    schema
  })

  return { db, pg }
}
