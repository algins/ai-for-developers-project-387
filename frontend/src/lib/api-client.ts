import axios, { AxiosError } from 'axios'
import i18next from 'i18next'

import { env } from '@/config/env'
import type { ApiErrorPayload } from '@/types/api'
import { ApiError } from '@/types/api'

const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    const status = error.response?.status ?? 500
    const payload = error.response?.data
    const message = payload?.message ?? error.message ?? i18next.t('common.unexpectedApiError')
    throw new ApiError(message, status, payload?.code)
  },
)

export { apiClient }
