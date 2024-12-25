import { create } from 'zustand'

interface ChatStore {
  activeId: string
  setActiveId: (id: string) => void
}

/**
 * Store the active chat id. It's useful when the useParams() doesn't update the id when we change the URL.
 * For example, in the submit handler in `app-input-msg`, we use window.history.replaceState() to change the URL.
 */
export const useChatStore = create<ChatStore>(set => ({
  activeId: '',
  setActiveId: id => set({ activeId: id })
}))
