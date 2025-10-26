import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  const testUser = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'Test1234',
  };

  test('complete auth flow: register → login → dashboard → logout', async ({ page }) => {
    // Register
    await page.goto('/register');
    await expect(page.locator('h2')).toContainText('Create your account');

    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);

    // Check password strength indicator
    await expect(page.locator('text=Good').or(page.locator('text=Strong'))).toBeVisible();

    await page.click('button[type="submit"]');

    // Should redirect to dashboard after registration
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: new RegExp(`Welcome, ${testUser.name}`) })).toBeVisible();

    // Logout
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL('/login');

    // Login again
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    // Should be back at dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: new RegExp(`Welcome, ${testUser.name}`) })).toBeVisible();

    // Verify dashboard content
    await expect(page.locator('text=Assets')).toBeVisible();
    await expect(page.locator('text=Software')).toBeVisible();
    await expect(page.locator('text=Services')).toBeVisible();
    await expect(page.locator('text=Warranties')).toBeVisible();
    await expect(page.locator('text=Runbooks')).toBeVisible();

    // Final logout
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL('/login');
  });

  test('login with invalid credentials should show error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'WrongPassword1');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('register with weak password should show strength warning', async ({ page }) => {
    await page.goto('/register');
    await page.fill('input[name="password"]', 'weak');

    await expect(page.locator('text=Too short').or(page.locator('text=Weak'))).toBeVisible();
  });

  test('unauthenticated access to dashboard should redirect to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });
});
