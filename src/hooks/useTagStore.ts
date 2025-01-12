import { create } from 'zustand'
import { generatePastelColor } from '../lib/utils'

const TAGS_STORAGE_KEY = 'xchat-tags'

interface TagData {
  name: string
  color: string
}

interface TagStore {
  tags: TagData[]
  addTags: (newTags: string[]) => void
  removeTag: (tagToRemove: string) => void
}

const getInitialTags = (): TagData[] => {
  if (typeof window === 'undefined') return []
  const storedTags = localStorage.getItem(TAGS_STORAGE_KEY)
  if (!storedTags) return []
  
  try {
    const parsed = JSON.parse(storedTags)
    if (typeof parsed[0] === 'string') {
      return parsed.map((name: string) => ({
        name,
        color: generatePastelColor()
      }))
    }
    return parsed
  } catch (e) {
    return []
  }
}

export const useTagStore = create<TagStore>((set) => ({
  tags: getInitialTags(),
  addTags: (newTags: string[]) =>
    set(state => {
      const existingTagNames = new Set(state.tags.map(t => t.name))
      const newTagData = newTags
        .filter(tag => !existingTagNames.has(tag))
        .map(tag => ({
          name: tag,
          color: generatePastelColor()
        }))
      
      const updatedTags = [...state.tags, ...newTagData]
      localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(updatedTags))
      return { tags: updatedTags }
    }),
  removeTag: (tagToRemove: string) =>
    set(state => {
      const newTags = state.tags.filter(tag => tag.name !== tagToRemove)
      localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(newTags))
      return { tags: newTags }
    })
}))
