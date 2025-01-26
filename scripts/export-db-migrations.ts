/**
 * We use this script to generate the export.json file that contains all the migrations.
 * Then we will import this file in the db.ts file to use it in the initializeDb function.
 *
 * How to use?
 * It's already integrated in the package.json file. You can run it using the following command:
 * yarn run db:generate
 */

import fs from 'node:fs/promises'

import { readMigrationFiles } from 'drizzle-orm/migrator'

const file = './src/db/migrations/export.json'

async function main() {
  const content = JSON.stringify(
    readMigrationFiles({
      migrationsFolder: './src/db/migrations'
    }),
    null,
    0
  )

  // Replace `CREATE TABLE` with `CREATE TABLE IF NOT EXISTS`
  const updatedContent = content.replace(/CREATE TABLE/g, 'CREATE TABLE IF NOT EXISTS')

  await fs.writeFile(`${file}`, updatedContent, {
    flag: 'w'
  })
}

if (require.main === module) {
  main()
}
