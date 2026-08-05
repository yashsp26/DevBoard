import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/authStore'

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

type PendingRequest = {
  reject: (reason?: unknown) => void
  resolve: () => void
}

let isRefreshing = false
let pendingRequests: PendingRequest[] = []

export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

function flushPendingRequests(error?: unknown) {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
      return
    }

    resolve()
  })

  pendingRequests = []
}

function waitForRefresh() {
  return new Promise<void>((resolve, reject) => {
    pendingRequests.push({ resolve, reject })
  })
}

function isRefreshOrLoginRequest(url: string | undefined) {
  return url === '/v1/auth/refresh' || url === '/v1/auth/login'
}

function handleRefreshFailure() {
  useAuthStore.getState().logout()
}

function redirectToErrorPage(path: '/forbidden' | '/network-error') {
  if (window.location.pathname !== path) {
    window.location.assign(path)
  }
}

function redirectToLogin() {
  if (window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined

    if (!error.response) {
      redirectToErrorPage('/network-error')
      return Promise.reject(error)
    }

    if (error.response.status === 403) {
      redirectToErrorPage('/forbidden')
      return Promise.reject(error)
    }

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isRefreshOrLoginRequest(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      try {
        await waitForRefresh()
        return apiClient(originalRequest)
      } catch {
        return Promise.reject(error)
      }
    }

    isRefreshing = true

    try {
      const { data } = await apiClient.post<{ data: { accessToken: string } }>('/v1/auth/refresh')
      useAuthStore.getState().setAccessToken(data.data.accessToken)
      flushPendingRequests()
      return apiClient(originalRequest)
    } catch (refreshError) {
      flushPendingRequests(refreshError)
      handleRefreshFailure()
      redirectToLogin()
      return Promise.reject(error)
    } finally {
      isRefreshing = false
    }
  },
)
