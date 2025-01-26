import fs from 'node:fs/promises'

import { readMigrationFiles } from 'drizzle-orm/migrator'

const file = './src/db/migrations/export.json'

async function main() {
  await fs.writeFile(
    `${file}`,
    JSON.stringify(
      readMigrationFiles({
        migrationsFolder: './src/db/migrations'
      }),
      null,
      0
    ),
    {
      flag: 'w'
    }
  )
}

if (require.main === module) {
  main()
}
