import { PGlite } from '@electric-sql/pglite'
import { live } from '@electric-sql/pglite/live'
import { vector } from '@electric-sql/pglite/vector'
import { PgDialect } from 'drizzle-orm/pg-core'
import { drizzle } from 'drizzle-orm/pglite'
import migrations from './migrations/export.json'
import * as schema from './schema'

const dbName = 'testChat'

const client = await PGlite.create({
  dataDir: `idb://${dbName}`,
  extensions: { vector, live }
})

const _db = drizzle(client, { schema })

let isLocalDBSchemaSynced = false

if (!isLocalDBSchemaSynced) {
  const start = performance.now()
  try {
    await new PgDialect().migrate(migrations, _db._.session as any, dbName)
    isLocalDBSchemaSynced = true
    console.info(`✅ Local database ready in ${performance.now() - start}ms`)
  } catch (error) {
    console.error(`❌ Local database failed to sync: ${error}`)
  }
}

const db = Object.assign(_db, {
  schema
})

export { db }
