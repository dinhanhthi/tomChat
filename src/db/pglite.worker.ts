/**
 * Using a single PGlite instance for all open tabs
 * https://pglite.dev/docs/multi-tab-worker
 */
import { PGlite } from '@electric-sql/pglite'
import { live } from '@electric-sql/pglite/live'
import { worker } from '@electric-sql/pglite/worker'
import { IDB_NAME } from '../lib/constants'

worker({
  async init() {
    return new PGlite({
      dataDir: IDB_NAME,
      extensions: {
        live // results updated when tables change (https://pglite.dev/docs/live-queries)
      }
    })
  }
})
