import { queryClient } from '../lib/queryClient'
import { useAuthStore } from '../store/authStore'

export function clearAuthSession() {
  useAuthStore.getState().logout()
  queryClient.clear()
}
