import { defineConfig, devices } from '@playwright/test';

const frontendDir = '../frontend';
const backendDir = '../backend';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 60_000,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command:
        'pip install -r requirements.txt -q && python -m uvicorn main:app --host 127.0.0.1 --port 8000',
      cwd: backendDir,
      url: 'http://127.0.0.1:8000/',
      timeout: 120_000,
      reuseExistingServer: true,
    },
    {
      command: 'npx --yes serve@14 -s build -l 3000',
      cwd: frontendDir,
      url: 'http://127.0.0.1:3000',
      timeout: 120_000,
      reuseExistingServer: true,
    },
  ],
});
