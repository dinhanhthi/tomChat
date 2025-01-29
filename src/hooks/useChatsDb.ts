import { useLiveQuery } from '@electric-sql/pglite-react'
import { NO_TAG } from '../lib/constants'
import { Chat } from '../db/schema'

export const useChatsDb = ({
  onlyArchived,
  alsoArchived,
  limit,
  tagName
}: {
  onlyArchived?: boolean
  alsoArchived?: boolean
  limit?: number
  tagName?: string
}) => {
  // Build the base query
  let query = `
    SELECT DISTINCT c.*
    FROM chats c
  `

  const params: any[] = []
  let whereConditions: string[] = []
  
  // Handle tag filtering
  if (tagName) {
    if (tagName !== NO_TAG) {
      query += `
        LEFT JOIN chat_tags ct ON c.id = ct.chat_id
        LEFT JOIN tags t ON ct.tag_id = t.id
      `
      whereConditions.push('t.name = $' + (params.length + 1))
      params.push(tagName)
    } else {
      query += `
        LEFT JOIN chat_tags ct ON c.id = ct.chat_id
      `
      whereConditions.push('ct.chat_id IS NULL')
    }
  }

  // Handle archived filtering
  if (onlyArchived) {
    whereConditions.push('c.archived = true')
  } else if (!alsoArchived) {
    whereConditions.push('c.archived = false')
  }

  // Add WHERE clause if we have conditions
  if (whereConditions.length > 0) {
    query += ' WHERE ' + whereConditions.join(' AND ')
  }

  // Add sorting
  query += ' ORDER BY c.updated_at DESC'

  // Add limit if specified
  if (limit) {
    query += ` LIMIT $${params.length + 1}`
    params.push(limit)
  }

  const chats = useLiveQuery<Chat>(query, params)

  return { chats: chats?.rows ?? [] }
}
