'use client'

import { PGliteProvider } from '@electric-sql/pglite-react'
import { createContext, useContext, useEffect, useState } from 'react'
import { initializeDb } from '../db/db'
import { models } from '../db/schema'

type DbLoadingContextType = {
  isLoading: boolean
  db?: any
}

const DbLoadingContext = createContext<DbLoadingContextType>({ isLoading: true, db: undefined })

export function useDbLoading() {
  return useContext(DbLoadingContext)
}

export default function PGliteWrapper({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<any>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const setupDatabase = async () => {
      const { db } = await initializeDb()
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

      /* ###Thi */ console.log(`👉👉👉 result wrapper: `, result)

      setDb(db)
      setIsLoading(false)
    }

    setupDatabase()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <DbLoadingContext.Provider value={{ isLoading, db }}>
      <PGliteProvider db={db}>{children}</PGliteProvider>
    </DbLoadingContext.Provider>
  )
}
