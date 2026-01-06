import { test, expect } from '@playwright/test';

test.describe('Visual Screenshots', () => {
  test('capture app workflow screenshots', async ({ page }) => {
    await page.goto('/');

    // 1. Empty state
    await page.screenshot({ path: 'screenshots/01-empty-state.png', fullPage: true });

    // 2. Add some todos
    const input = page.getByPlaceholder('Add a new todo...');

    await input.fill('Buy groceries');
    await page.getByRole('button', { name: 'Add' }).click();

    await input.fill('Walk the dog');
    await page.getByRole('button', { name: 'Add' }).click();

    await input.fill('Finish project report');
    await page.getByRole('button', { name: 'Add' }).click();

    await input.fill('Call mom');
    await page.getByRole('button', { name: 'Add' }).click();

    await page.screenshot({ path: 'screenshots/02-todos-added.png', fullPage: true });

    // 3. Complete some todos
    const buyGroceries = page.locator('li').filter({ hasText: 'Buy groceries' });
    await buyGroceries.getByRole('checkbox').click();

    const walkDog = page.locator('li').filter({ hasText: 'Walk the dog' });
    await walkDog.getByRole('checkbox').click();

    await page.screenshot({ path: 'screenshots/03-some-completed.png', fullPage: true });

    // 4. Delete a todo
    const finishProject = page.locator('li').filter({ hasText: 'Finish project report' });
    await finishProject.getByRole('button', { name: 'Delete' }).click();

    await page.screenshot({ path: 'screenshots/04-after-delete.png', fullPage: true });

    // Verify final state
    await expect(page.getByText('Total: 3')).toBeVisible();
    await expect(page.getByText('Completed: 2')).toBeVisible();
    await expect(page.getByText('Active: 1')).toBeVisible();
  });
});
