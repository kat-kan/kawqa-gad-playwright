/* eslint-disable  @typescript-eslint/no-unused-vars */
import { defineConfig, devices } from '@playwright/test';
// import * as dotenv from 'dotenv';
import * as path from 'path';

export const STORAGE_STATE = path.join(__dirname, 'tmp/session.json');

export default defineConfig({
  testDir: './tests',
  globalSetup: './src/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['json', { outputFile: './playwright-report.json' }]],
  snapshotPathTemplate: '{testDir}/visual/{testFileName}-snapshots/{arg}{ext}',
  use: {
    baseURL: process.env.BASE_URL,
    ignoreHTTPSErrors: true,
    trace: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      grepInvert: /@logged/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'setup',
      testMatch: '*.setup.ts',
    },
    {
      name: 'chromium-logged-gui',
      grep: /@logged/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
    },
  ],
});
