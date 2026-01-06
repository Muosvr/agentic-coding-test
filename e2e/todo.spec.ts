import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Initial State', () => {
    test('should display the app title', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Todo List');
    });

    test('should show empty state message when no todos exist', async ({ page }) => {
      await expect(page.getByText('No todos yet. Add one to get started!')).toBeVisible();
    });

    test('should not show statistics when no todos exist', async ({ page }) => {
      await expect(page.getByText('Total:')).not.toBeVisible();
    });

    test('should have an input field and Add button', async ({ page }) => {
      await expect(page.getByPlaceholder('Add a new todo...')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
    });
  });

  test.describe('Adding Todos', () => {
    test('should add a todo when clicking the Add button', async ({ page }) => {
      const input = page.getByPlaceholder('Add a new todo...');
      await input.fill('Buy groceries');
      await page.getByRole('button', { name: 'Add' }).click();

      await expect(page.getByText('Buy groceries')).toBeVisible();
      await expect(input).toHaveValue('');
    });

    test('should add a todo when pressing Enter', async ({ page }) => {
      const input = page.getByPlaceholder('Add a new todo...');
      await input.fill('Walk the dog');
      await input.press('Enter');

      await expect(page.getByText('Walk the dog')).toBeVisible();
      await expect(input).toHaveValue('');
    });

    test('should not add empty todos', async ({ page }) => {
      await page.getByRole('button', { name: 'Add' }).click();
      await expect(page.getByText('No todos yet. Add one to get started!')).toBeVisible();
    });

    test('should not add whitespace-only todos', async ({ page }) => {
      const input = page.getByPlaceholder('Add a new todo...');
      await input.fill('   ');
      await page.getByRole('button', { name: 'Add' }).click();

      await expect(page.getByText('No todos yet. Add one to get started!')).toBeVisible();
    });

    test('should add multiple todos', async ({ page }) => {
      const input = page.getByPlaceholder('Add a new todo...');

      await input.fill('First todo');
      await page.getByRole('button', { name: 'Add' }).click();

      await input.fill('Second todo');
      await page.getByRole('button', { name: 'Add' }).click();

      await input.fill('Third todo');
      await page.getByRole('button', { name: 'Add' }).click();

      await expect(page.getByText('First todo')).toBeVisible();
      await expect(page.getByText('Second todo')).toBeVisible();
      await expect(page.getByText('Third todo')).toBeVisible();
    });
  });

  test.describe('Completing Todos', () => {
    test('should toggle todo completion status', async ({ page }) => {
      const input = page.getByPlaceholder('Add a new todo...');
      await input.fill('Test todo');
      await page.getByRole('button', { name: 'Add' }).click();

      const checkbox = page.getByRole('checkbox');
      await expect(checkbox).not.toBeChecked();

      await checkbox.click();
      await expect(checkbox).toBeChecked();

      await checkbox.click();
      await expect(checkbox).not.toBeChecked();
    });

    test('should apply strikethrough style to completed todos', async ({ page }) => {
      const input = page.getByPlaceholder('Add a new todo...');
      await input.fill('Complete me');
      await page.getByRole('button', { name: 'Add' }).click();

      const todoText = page.locator('span').filter({ hasText: 'Complete me' });
      await expect(todoText).not.toHaveClass(/line-through/);

      await page.getByRole('checkbox').click();
      await expect(todoText).toHaveClass(/line-through/);
    });
  });

  test.describe('Deleting Todos', () => {
    test('should delete a todo', async ({ page }) => {
      const input = page.getByPlaceholder('Add a new todo...');
      await input.fill('Delete me');
      await page.getByRole('button', { name: 'Add' }).click();

      await expect(page.getByText('Delete me')).toBeVisible();

      await page.getByRole('button', { name: 'Delete' }).click();

      await expect(page.getByText('Delete me')).not.toBeVisible();
      await expect(page.getByText('No todos yet. Add one to get started!')).toBeVisible();
    });

    test('should delete the correct todo from multiple todos', async ({ page }) => {
      const input = page.getByPlaceholder('Add a new todo...');

      await input.fill('Keep me 1');
      await page.getByRole('button', { name: 'Add' }).click();

      await input.fill('Delete me');
      await page.getByRole('button', { name: 'Add' }).click();

      await input.fill('Keep me 2');
      await page.getByRole('button', { name: 'Add' }).click();

      // Delete the middle todo
      const todoToDelete = page.locator('li').filter({ hasText: 'Delete me' });
      await todoToDelete.getByRole('button', { name: 'Delete' }).click();

      await expect(page.getByText('Keep me 1')).toBeVisible();
      await expect(page.getByText('Delete me')).not.toBeVisible();
      await expect(page.getByText('Keep me 2')).toBeVisible();
    });
  });

  test.describe('Statistics', () => {
    test('should display correct statistics', async ({ page }) => {
      const input = page.getByPlaceholder('Add a new todo...');

      await input.fill('Todo 1');
      await page.getByRole('button', { name: 'Add' }).click();

      await input.fill('Todo 2');
      await page.getByRole('button', { name: 'Add' }).click();

      await input.fill('Todo 3');
      await page.getByRole('button', { name: 'Add' }).click();

      await expect(page.getByText('Total: 3')).toBeVisible();
      await expect(page.getByText('Completed: 0')).toBeVisible();
      await expect(page.getByText('Active: 3')).toBeVisible();
    });

    test('should update statistics when completing todos', async ({ page }) => {
      const input = page.getByPlaceholder('Add a new todo...');

      await input.fill('Todo 1');
      await page.getByRole('button', { name: 'Add' }).click();

      await input.fill('Todo 2');
      await page.getByRole('button', { name: 'Add' }).click();

      // Complete one todo
      await page.getByRole('checkbox').first().click();

      await expect(page.getByText('Total: 2')).toBeVisible();
      await expect(page.getByText('Completed: 1')).toBeVisible();
      await expect(page.getByText('Active: 1')).toBeVisible();
    });

    test('should update statistics when deleting todos', async ({ page }) => {
      const input = page.getByPlaceholder('Add a new todo...');

      await input.fill('Todo 1');
      await page.getByRole('button', { name: 'Add' }).click();

      await input.fill('Todo 2');
      await page.getByRole('button', { name: 'Add' }).click();

      await expect(page.getByText('Total: 2')).toBeVisible();

      await page.getByRole('button', { name: 'Delete' }).first().click();

      await expect(page.getByText('Total: 1')).toBeVisible();
    });

    test('should hide statistics when all todos are deleted', async ({ page }) => {
      const input = page.getByPlaceholder('Add a new todo...');
      await input.fill('Only todo');
      await page.getByRole('button', { name: 'Add' }).click();

      await expect(page.getByText('Total: 1')).toBeVisible();

      await page.getByRole('button', { name: 'Delete' }).click();

      await expect(page.getByText('Total:')).not.toBeVisible();
    });
  });

  test.describe('Sorting', () => {
    test('should sort completed todos to the bottom', async ({ page }) => {
      const input = page.getByPlaceholder('Add a new todo...');

      await input.fill('First todo');
      await page.getByRole('button', { name: 'Add' }).click();

      await input.fill('Second todo');
      await page.getByRole('button', { name: 'Add' }).click();

      await input.fill('Third todo');
      await page.getByRole('button', { name: 'Add' }).click();

      // Complete the first todo
      await page.getByRole('checkbox').first().click();

      // Get all todo texts in order
      const todoTexts = await page.locator('li span.flex-1').allTextContents();

      // The completed todo should be at the end
      expect(todoTexts[todoTexts.length - 1]).toBe('First todo');
    });
  });

  test.describe('Complete User Flow', () => {
    test('should support a full workflow: add, complete, and delete todos', async ({ page }) => {
      const input = page.getByPlaceholder('Add a new todo...');

      // Add todos
      await input.fill('Buy milk');
      await page.getByRole('button', { name: 'Add' }).click();

      await input.fill('Read a book');
      await input.press('Enter');

      await input.fill('Exercise');
      await page.getByRole('button', { name: 'Add' }).click();

      // Verify all todos are added
      await expect(page.getByText('Buy milk')).toBeVisible();
      await expect(page.getByText('Read a book')).toBeVisible();
      await expect(page.getByText('Exercise')).toBeVisible();
      await expect(page.getByText('Total: 3')).toBeVisible();

      // Complete some todos
      const buyMilkItem = page.locator('li').filter({ hasText: 'Buy milk' });
      await buyMilkItem.getByRole('checkbox').click();

      const readBookItem = page.locator('li').filter({ hasText: 'Read a book' });
      await readBookItem.getByRole('checkbox').click();

      await expect(page.getByText('Completed: 2')).toBeVisible();
      await expect(page.getByText('Active: 1')).toBeVisible();

      // Delete a todo
      const exerciseItem = page.locator('li').filter({ hasText: 'Exercise' });
      await exerciseItem.getByRole('button', { name: 'Delete' }).click();

      await expect(page.getByText('Exercise')).not.toBeVisible();
      await expect(page.getByText('Total: 2')).toBeVisible();
      await expect(page.getByText('Active: 0')).toBeVisible();
    });
  });
});
