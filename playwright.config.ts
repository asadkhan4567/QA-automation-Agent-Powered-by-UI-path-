import { defineConfig, devices } from '@playwright/test';

/**
 * Config used locally and by .github/workflows/qa-e2e.yml.
 * BASE_URL comes from the workflow input (Orchestrator asset QA_BaseUrl); never hardcoded in specs.
 * results.json is the contract the UiPath "Trigger and Monitor CI" step downloads and the
 * Failure Triage Agent reads.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: Number(process.env.RETRIES ?? (process.env.CI ? 2 : 0)),
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    // SauceDemo uses data-test attributes; map getByTestId to them.
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
