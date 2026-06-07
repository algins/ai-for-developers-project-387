import { AlertCircle } from 'lucide-react'
import type { PropsWithChildren, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

interface QueryStateProps extends PropsWithChildren {
  isLoading: boolean
  error: Error | null
  emptyText?: string
  isEmpty?: boolean
  loadingFallback?: ReactNode
}

export function QueryState({
  isLoading,
  error,
  isEmpty = false,
  emptyText,
  loadingFallback,
  children,
}: QueryStateProps) {
  const { t } = useTranslation()
  const resolvedEmptyText = emptyText ?? t('common.noDataYet')

  if (isLoading) {
    if (loadingFallback) {
      return <>{loadingFallback}</>
    }
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('common.requestFailed')}</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  if (isEmpty) {
    return (
      <Alert>
        <AlertTitle>{t('common.emptyState')}</AlertTitle>
        <AlertDescription>{resolvedEmptyText}</AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}
