import { expect, test } from '@playwright/test'

test.describe('Real booking journey', () => {
  test.describe.configure({ mode: 'serial' })

  const suffix = Date.now()
  const eventTypeName = `E2E Event ${suffix}`
  const eventTypeDescription = `Created by Playwright at ${suffix}`
  const guestName = `E2E Guest ${suffix}`
  const guestEmail = `e2e+${suffix}@example.com`

  test('scenario 1: create event type from admin area', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Admin area' }).click()
    await page.getByRole('link', { name: 'Event types' }).click()
    await expect(page).toHaveURL('/admin/event-types')

    await page.getByRole('button', { name: 'Create event type' }).click()
    await expect(page).toHaveURL('/admin/event-types/create')

    await page.getByLabel('Name').fill(eventTypeName)
    await page.getByLabel('Duration (minutes)').fill('30')
    await page.getByLabel('Description').fill(eventTypeDescription)
    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page).toHaveURL('/admin/event-types')
    await expect(page.getByText('Event type created')).toBeVisible()

    const createdEventTypeRow = page.getByRole('row').filter({ hasText: eventTypeName })
    await expect(createdEventTypeRow).toBeVisible()
  })

  test('scenario 2: book a slot from public page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Book now' }).click()
    await expect(page).toHaveURL('/')

    const eventCard = page.locator('.group').filter({ hasText: eventTypeName }).first()
    await expect(eventCard).toBeVisible()
    await eventCard.getByRole('link', { name: 'Open calendar' }).click()

    await expect(page).toHaveURL(/\/event-types\//)

    await page.getByLabel('Your name').fill(guestName)
    await page.getByLabel('Email').fill(guestEmail)

    const dayButtons = page
      .getByRole('button')
      .filter({ hasText: /\d+ slots/ })
    await expect(dayButtons.nth(1)).toBeVisible()
    await dayButtons.nth(1).click()

    const availableSlot = page.locator('button:has-text("UTC"):not([disabled])').first()
    await expect(availableSlot).toBeVisible()
    await availableSlot.click()

    await page.getByRole('button', { name: 'Continue' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByText('Booking created')).toBeVisible()
  })

  test('scenario 3: verify booking in admin bookings list', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Admin area' }).click()
    await page.getByRole('link', { name: 'Bookings' }).click()
    await expect(page).toHaveURL('/admin/bookings')

    const bookingRow = page.getByRole('row').filter({ hasText: guestName })
    await expect(bookingRow).toBeVisible()
  })
})
