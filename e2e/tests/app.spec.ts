import { test, expect } from '@playwright/test';

test.describe('Pipeline Editor UI', () => {
  test('loads editor and disables submit on empty canvas', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Pipeline Editor' })).toBeVisible();
    await expect(page.getByTestId('submit-pipeline')).toBeDisabled();
  });

  test('template load and submit shows window alert with pipeline stats', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /Parallel Branch \(DAG\)/i }).click();
    await page.getByRole('button', { name: 'Use this template' }).click();

    const submit = page.getByTestId('submit-pipeline');
    await expect(submit).toBeEnabled();

    const dialogPromise = page.waitForEvent('dialog');
    await submit.click();
    const dialog = await dialogPromise;

    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toContain('Pipeline analysis');
    expect(dialog.message()).toContain('Number of nodes:');
    expect(dialog.message()).toContain('Number of edges:');
    expect(dialog.message()).toMatch(/Is DAG: Yes/i);
    await dialog.accept();
  });
});
