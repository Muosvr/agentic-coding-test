import { test, expect } from '@playwright/test'

test.describe('Todo List App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the app title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '📝 Todo List' })).toBeVisible()
  })

  test('should show empty state message when no todos exist', async ({ page }) => {
    await expect(page.getByText('No todos yet. Add one to get started!')).toBeVisible()
  })

  test('should add a new todo', async ({ page }) => {
    const todoText = 'Buy groceries'

    // Type into input and click Add button
    await page.getByPlaceholder('Add a new todo...').fill(todoText)
    await page.getByRole('button', { name: 'Add' }).click()

    // Verify todo appears in the list
    await expect(page.getByText(todoText)).toBeVisible()

    // Verify input is cleared
    await expect(page.getByPlaceholder('Add a new todo...')).toHaveValue('')
  })

  test('should add todo by pressing Enter key', async ({ page }) => {
    const todoText = 'Write tests'

    // Type into input and press Enter
    await page.getByPlaceholder('Add a new todo...').fill(todoText)
    await page.getByPlaceholder('Add a new todo...').press('Enter')

    // Verify todo appears
    await expect(page.getByText(todoText)).toBeVisible()
  })

  test('should not add empty todo', async ({ page }) => {
    // Click Add without typing anything
    await page.getByRole('button', { name: 'Add' }).click()

    // Verify empty state message is still visible
    await expect(page.getByText('No todos yet. Add one to get started!')).toBeVisible()
  })

  test('should toggle todo completion', async ({ page }) => {
    const todoText = 'Complete project'

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill(todoText)
    await page.getByRole('button', { name: 'Add' }).click()

    // Get the todo item checkbox
    const checkbox = page.locator('input[type="checkbox"]').first()

    // Initially unchecked
    await expect(checkbox).not.toBeChecked()

    // Click checkbox to complete
    await checkbox.click()
    await expect(checkbox).toBeChecked()

    // Verify text has line-through style
    const todoItem = page.getByText(todoText)
    await expect(todoItem).toHaveClass(/line-through/)

    // Click again to uncomplete
    await checkbox.click()
    await expect(checkbox).not.toBeChecked()
  })

  test('should delete a todo', async ({ page }) => {
    const todoText = 'Delete me'

    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill(todoText)
    await page.getByRole('button', { name: 'Add' }).click()

    // Verify todo exists
    await expect(page.getByText(todoText)).toBeVisible()

    // Click delete button
    await page.getByRole('button', { name: 'Delete' }).click()

    // Verify todo is removed
    await expect(page.getByText(todoText)).not.toBeVisible()

    // Verify empty state is shown
    await expect(page.getByText('No todos yet. Add one to get started!')).toBeVisible()
  })

  test('should move completed todos to bottom', async ({ page }) => {
    // Add multiple todos
    const todos = ['First task', 'Second task', 'Third task']

    for (const todo of todos) {
      await page.getByPlaceholder('Add a new todo...').fill(todo)
      await page.getByRole('button', { name: 'Add' }).click()
    }

    // Complete the first todo
    const firstCheckbox = page.locator('input[type="checkbox"]').first()
    await firstCheckbox.click()

    // Get all todo text elements
    const todoItems = page.locator('ul li span.flex-1')

    // The completed 'First task' should now be at the bottom (index 2)
    await expect(todoItems.nth(0)).toContainText('Second task')
    await expect(todoItems.nth(1)).toContainText('Third task')
    await expect(todoItems.nth(2)).toContainText('First task')
  })

  test('should display correct statistics', async ({ page }) => {
    // Add 3 todos
    const todos = ['Task 1', 'Task 2', 'Task 3']

    for (const todo of todos) {
      await page.getByPlaceholder('Add a new todo...').fill(todo)
      await page.getByRole('button', { name: 'Add' }).click()
    }

    // Verify initial stats: 3 total, 0 completed, 3 active
    await expect(page.getByText('Total: 3')).toBeVisible()
    await expect(page.getByText('Completed: 0')).toBeVisible()
    await expect(page.getByText('Active: 3')).toBeVisible()

    // Complete one todo
    await page.locator('input[type="checkbox"]').first().click()

    // Verify updated stats: 3 total, 1 completed, 2 active
    await expect(page.getByText('Total: 3')).toBeVisible()
    await expect(page.getByText('Completed: 1')).toBeVisible()
    await expect(page.getByText('Active: 2')).toBeVisible()
  })

  test('should handle multiple todos correctly', async ({ page }) => {
    const todos = ['Buy milk', 'Walk the dog', 'Read a book', 'Exercise']

    // Add all todos
    for (const todo of todos) {
      await page.getByPlaceholder('Add a new todo...').fill(todo)
      await page.getByRole('button', { name: 'Add' }).click()
    }

    // Verify all todos are visible
    for (const todo of todos) {
      await expect(page.getByText(todo)).toBeVisible()
    }

    // Complete some todos
    await page.locator('input[type="checkbox"]').nth(0).click()
    await page.locator('input[type="checkbox"]').nth(1).click()

    // Delete one todo
    await page.getByRole('button', { name: 'Delete' }).first().click()

    // Verify stats
    await expect(page.getByText('Total: 3')).toBeVisible()
  })

  test('should maintain state when adding todos after completion', async ({ page }) => {
    // Add a todo
    await page.getByPlaceholder('Add a new todo...').fill('First todo')
    await page.getByRole('button', { name: 'Add' }).click()

    // Complete it
    await page.locator('input[type="checkbox"]').first().click()

    // Add another todo
    await page.getByPlaceholder('Add a new todo...').fill('Second todo')
    await page.getByRole('button', { name: 'Add' }).click()

    // Verify order: incomplete first, completed at bottom
    const todoItems = page.locator('ul li span.flex-1')
    await expect(todoItems.nth(0)).toContainText('Second todo')
    await expect(todoItems.nth(1)).toContainText('First todo')
  })
})
