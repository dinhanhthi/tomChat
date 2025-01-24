import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  driver: "pglite",
  dbCredentials: {
    // url: './database/',
    url: 'idb://tomChat'
  }
})
