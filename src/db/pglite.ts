import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { models } from './schema'

// const client = new PGlite('idb://testChat')
// const db = drizzle({ client })

// export { db, models }

async function initializeDatabase() {
  // const client = await PGlite.create('idb://testChat');
  const client = new PGlite('idb://testChat');
  const db = drizzle({client});
  return db;
}

export { initializeDatabase, models };