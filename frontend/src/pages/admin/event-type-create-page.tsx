import { zodResolver } from '@hookform/resolvers/zod'
import type { TFunction } from 'i18next'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateEventType } from '@/hooks/use-api'

function createEventTypeSchema(t: TFunction) {
  return z.object({
    name: z
      .string()
      .min(1, t('admin.eventTypes.validation.nameRequired'))
      .max(100, t('admin.eventTypes.validation.nameMax', { max: 100 })),
    description: z.string().max(1000, t('admin.eventTypes.validation.descriptionMax', { max: 1000 })),
    durationMinutes: z
      .number()
      .int()
      .min(5, t('admin.eventTypes.validation.durationMin', { min: 5 }))
      .max(480, t('admin.eventTypes.validation.durationMax', { max: 480 })),
  })
}

type EventTypeFormData = z.infer<ReturnType<typeof createEventTypeSchema>>

export function AdminEventTypeCreatePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const eventTypeSchema = createEventTypeSchema(t)
  const createEventType = useCreateEventType()

  const form = useForm<EventTypeFormData>({
    resolver: zodResolver(eventTypeSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      durationMinutes: 30,
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createEventType.mutateAsync(values)
      toast.success(t('admin.eventTypes.toasts.created'))
      navigate('/admin/event-types')
    } catch (error) {
      const message = error instanceof Error ? error.message : t('admin.eventTypes.toasts.createFailed')
      toast.error(message)
    }
  })

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{t('admin.eventTypes.heading')}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{t('admin.eventTypes.createDescription')}</p>
      </div>

      <Card className="p-6">
        <CardContent className="p-0">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">{t('admin.eventTypes.labels.name')}</Label>
              <Input id="name" {...form.register('name')} />
              {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="durationMinutes">{t('admin.eventTypes.labels.durationMinutes')}</Label>
              <Input
                id="durationMinutes"
                type="number"
                min={5}
                max={480}
                {...form.register('durationMinutes', { valueAsNumber: true })}
              />
              {form.formState.errors.durationMinutes && (
                <p className="text-sm text-destructive">{form.formState.errors.durationMinutes.message}</p>
              )}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="description">{t('admin.eventTypes.labels.description')}</Label>
              <Textarea id="description" {...form.register('description')} />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="md:col-span-2 pt-2">
              <Button className="cursor-pointer" type="submit">
                {t('public.eventType.actions.continue')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
