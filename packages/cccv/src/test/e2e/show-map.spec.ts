import { test, expect } from '@playwright/test'

test('home page should have the correct title and welcome message', async ({
  page
}) => {
  await page.goto('http://localhost:5173/map/@-41,175.35,8z')

  await expect(page.getByTestId('InteractiveMap')).toBeVisible()
})

test('Happy path - select an FMU, check for Tangata Whenua site and change map style', async ({ page }) => {
  
  await page.goto('http://localhost:5173/map/@-41,175.35,8z')

  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 639,
      y: 410
    }
  })

  await page.getByLabel('Map', { exact: true }).click({
    position: {
      x: 653,
      y: 344
    }
  })

  await expect(page.getByText('Te Ahikouka, Ruamāhanga River')).toBeVisible()

  // Test select box without knowing exact values, just that aerial is default
  const aerial = await page.getByRole('combobox').inputValue()
  const topographic = aerial.replace('aerial', 'topographic')

  await page.getByRole('combobox').selectOption(topographic)
})