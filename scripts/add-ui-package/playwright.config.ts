import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: './test/e2e', // Adjust based on your project structure
  testMatch: '*.spec.{ts,tsx}'
}

export default config
