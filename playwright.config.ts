import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean((globalThis as any).process?.env?.CI);
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Keep tests sequential to avoid cross-test interference on the live site */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry transient failures locally too since the target site is live */
  retries: isCI ? 2 : 0,
  /* Use a single worker locally to reduce flakiness from the live site */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    launchOptions: {
      slowMo: 150,
    },
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://automationexercise.com/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'API Tests',
      use: { baseURL: 'https://automationexercise.com/api/' }, // Backend base
      testMatch: /.*api.*\.spec\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /.*api.*\.spec\.ts/,
    },

    //{
      //name: 'firefox',
      //use: { ...devices['Desktop Firefox'] },
    //},

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: /.*api.*\.spec\.ts/,
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

