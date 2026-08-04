import { isAxiosError } from 'axios'

function hasMessage(value: unknown): value is { message: string } {
  return typeof value === 'object' && value !== null && 'message' in value && typeof value.message === 'string'
}

function hasValidationErrors(value: unknown): value is { errors: Array<{ message?: unknown }> } {
  return typeof value === 'object' && value !== null && 'errors' in value && Array.isArray(value.errors)
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
      if (hasValidationErrors(error.response.data)) {
        const validationMessages = error.response.data.errors
          .map((issue) => typeof issue.message === 'string' ? issue.message : undefined)
          .filter((message): message is string => Boolean(message))

        if (validationMessages.length) {
          return validationMessages.join(' ')
        }
      }

      return error.response.data.message
    }
  }

  return error instanceof Error && error.message ? error.message : fallback
}
