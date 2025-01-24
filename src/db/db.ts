import { drizzle } from 'drizzle-orm/pglite'
import { pg } from './pglite'
import * as schema from './schema'

export const db = drizzle({
  client: pg as any,
  schema
})
