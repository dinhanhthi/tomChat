import { create } from 'zustand'

const TAGS_STORAGE_KEY = 'xchat-tags'

interface TagStore {
  tags: string[]
  addTags: (newTags: string[]) => void
  removeTag: (tagToRemove: string) => void
}

const getInitialTags = (): string[] => {
  if (typeof window === 'undefined') return []
  const storedTags = localStorage.getItem(TAGS_STORAGE_KEY)
  return storedTags ? JSON.parse(storedTags) : []
}

export const useTagStore = create<TagStore>(set => ({
  tags: getInitialTags(),
  addTags: (newTags: string[]) =>
    set(state => {
      const uniqueTags = [...new Set([...state.tags, ...newTags])]
      localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(uniqueTags))
      return { tags: uniqueTags }
    }),
  removeTag: (tagToRemove: string) =>
    set(state => {
      const newTags = state.tags.filter(tag => tag !== tagToRemove)
      localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(newTags))
      return { tags: newTags }
    })
}))
