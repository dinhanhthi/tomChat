'use client'

import { PGliteProvider } from '@electric-sql/pglite-react'
import { PGliteWithLive } from '@electric-sql/pglite/live'
import { useEffect, useState } from 'react'
import { initializeDb } from '../db/db'
import { models } from '../db/schema'

export default function PGliteWrapper({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<PGliteWithLive>()

  useEffect(() => {
    const setupDatabase = async () => {
      const db = await initializeDb() as any
      const result = await db.select().from(models)

      if (result.length === 0) {
        console.log('No data found, inserting initial data...')
        await db.insert(models).values({
          id: '1',
          name: 'Model A',
          service: 'openai',
          context: 2048
        })
      }

      setDb(db)
    }

    setupDatabase()
  }, [])

  if (!db) {
    return <div>Loading database...</div>
  }

  return <PGliteProvider db={db}>{children}</PGliteProvider>
}
