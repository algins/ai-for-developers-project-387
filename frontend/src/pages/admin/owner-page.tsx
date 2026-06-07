import { QueryState } from '@/components/feedback/query-state'
import { OwnerPageSkeleton } from '@/components/feedback/skeletons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminOwner } from '@/hooks/use-api'
import { Fingerprint, Mail, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function AdminOwnerPage() {
  const { t } = useTranslation()
  const { data, isLoading, error } = useAdminOwner()

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{t('admin.owner.heading')}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{t('admin.owner.description')}</p>
      </div>

      <QueryState isLoading={isLoading} error={(error as Error) ?? null} loadingFallback={<OwnerPageSkeleton />}>
        <Card className="border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-muted-foreground" />
              {data?.name}
            </CardTitle>
            <CardDescription>{t('admin.owner.ownerId', { id: data?.id ?? '-' })}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2.5 sm:grid-cols-2">
            <div className="rounded-md border border-border/70 bg-card p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Fingerprint className="h-3.5 w-3.5" />
                {t('admin.owner.labels.id')}
              </p>
              <p className="mt-1 font-mono text-sm">{data?.id ?? '-'}</p>
            </div>
            <div className="rounded-md border border-border/70 bg-card p-3.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {t('admin.owner.labels.email')}
              </p>
              <p className="mt-1 text-sm">{data?.email ?? t('common.unknown')}</p>
            </div>
          </CardContent>
        </Card>
      </QueryState>
    </section>
  )
}
