import { test, expect } from '@playwright/test'

test('home page should have the correct title and welcome message', async ({
  page
}) => {
  await page.goto('http://localhost:5173/map/@-41,175.35,8z')

  await expect(page.getByTestId('InteractiveMap')).toBeVisible()
})