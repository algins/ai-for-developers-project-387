import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <section className="space-y-3 text-center">
      <h2 className="text-2xl font-semibold">{t('notFound.title')}</h2>
      <p className="text-muted-foreground">{t('notFound.description')}</p>
      <p>
        <Link className="text-primary underline-offset-4 hover:underline" to="/">
          {t('notFound.goHome')}
        </Link>
      </p>
    </section>
  )
}
