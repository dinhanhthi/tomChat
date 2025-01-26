import { defineConfig } from 'drizzle-kit'
import { IDB_NAME } from './src/lib/constants'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: 'pglite',
  // Not working with studio
  dbCredentials: {
    url: IDB_NAME
  },
  verbose: true
})
