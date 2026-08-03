import { isAxiosError } from 'axios'

function hasMessage(value: unknown): value is { message: string } {
  return typeof value === 'object' && value !== null && 'message' in value && typeof value.message === 'string'
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    if ((error.response?.status ?? 0) >= 500) {
      return fallback
    }

    if (typeof error.response?.data === 'string') {
      return error.response.data
    }

    if (hasMessage(error.response?.data)) {
      return error.response.data.message
    }
  }

  return error instanceof Error && error.message ? error.message : fallback
}
