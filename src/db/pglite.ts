import { PGlite } from '@electric-sql/pglite'
import { live } from '@electric-sql/pglite/live'
import { drizzle } from 'drizzle-orm/pglite'
import { IDB_NAME } from '../lib/constants'
import { models } from './schema'

async function initializeDatabase() {
  const client = new PGlite({
    dataDir: IDB_NAME,
    extensions: { live }
  })
  const db = drizzle({ client })
  return db
}

export { initializeDatabase, models }
