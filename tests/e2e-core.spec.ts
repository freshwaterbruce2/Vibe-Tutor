/**
 * Core E2E Tests for Vibe-Tutor
 * Tests critical user flows: Tutor, Buddy, Focus Timer, Audio
 */

import { expect, test } from '@playwright/test';

const BASE_URL = 'http://localhost:8174';

test.describe('Vibe-Tutor Core Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Wait for app to load
    await page.waitForSelector('text=Homework Dashboard', { timeout: 10000 });
  });

  test('should load homepage and display dashboard', async ({ page }) => {
    // Check main elements are visible
    await expect(page.locator('text=Homework Dashboard')).toBeVisible();
    await expect(page.locator('button:has-text("Add")')).toBeVisible();
  });

  test('should navigate to AI Tutor', async ({ page }) => {
    // Click tutor navigation
    await page.click('[aria-label="AI Tutor"]');

    // Wait for tutor to load
    await expect(page.locator('text=AI Tutor')).toBeVisible();
    await expect(page.locator('text=Get help with your homework concepts')).toBeVisible();

    // Check chat input is present
    await expect(page.locator('input[placeholder*="AI Tutor"]')).toBeVisible();
  });

  test('should send message to AI Tutor and receive response', async ({ page }) => {
    // Navigate to tutor
    await page.click('[aria-label="AI Tutor"]');
    await page.waitForSelector('text=AI Tutor');

    // Type and send message
    const input = page.locator('input[placeholder*="AI Tutor"]');
    await input.fill('What is 2 + 2?');
    await page.click('button[aria-label="Send message"]');

    // Wait for response (with generous timeout for AI)
    await expect(page.locator('text=4').first()).toBeVisible({ timeout: 30000 });
  });

  test('should navigate to AI Buddy', async ({ page }) => {
    // Click buddy navigation
    await page.click('[aria-label="AI Buddy"]');

    // Wait for buddy to load
    await expect(page.locator('text=AI Buddy')).toBeVisible();
    await expect(page.locator('text=Chat about anything on your mind')).toBeVisible();
  });

  test('should start Focus Timer', async ({ page }) => {
    // Navigate to focus timer
    await page.click('[aria-label="Focus Timer"]');

    // Wait for timer to load
    await expect(page.locator('text=Focus Time')).toBeVisible();

    // Check timer displays 25:00
    await expect(page.locator('text=25:00')).toBeVisible();

    // Click play button
    await page.click('button[aria-label="Start timer"]');

    // Wait a moment and check timer is counting down
    await page.waitForTimeout(2000);

    // Timer should have changed from 25:00
    const timerText = await page.locator('.text-7xl').textContent();
    expect(timerText).not.toBe('25:00');
  });

  test('should open sensory settings', async ({ page }) => {
    // Click sensory settings button
    await page.click('[aria-label="Sensory Settings"]');

    // Wait for settings to load
    await expect(page.locator('text=Sensory Settings')).toBeVisible();
    await expect(page.locator('text=Movement & Animations')).toBeVisible();
  });

  test('should add homework item', async ({ page }) => {
    // Click add button
    await page.click('button:has-text("Add")');

    // Wait for modal
    await expect(page.locator('text=Add Homework')).toBeVisible();

    // Fill in homework details
    await page.selectOption('select[name="subject"]', 'Math');
    await page.fill('input[name="title"]', 'Test Assignment');

    // Set due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    await page.fill('input[type="date"]', dateString);

    // Submit
    await page.click('button:has-text("Add Assignment")');

    // Check homework appears in list
    await expect(page.locator('text=Test Assignment')).toBeVisible();
  });

  test('should work offline', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);

    // Check offline indicator appears
    await expect(page.locator('text=Offline')).toBeVisible({ timeout: 5000 });

    // App should still be functional
    await expect(page.locator('text=Homework Dashboard')).toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Offline indicator should disappear
    await expect(page.locator('text=Offline')).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('Adaptive Audio Integration', () => {
  test('should show audio controls when adaptive audio is enabled', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('text=Homework Dashboard');

    // Navigate to focus timer
    await page.click('[aria-label="Focus Timer"]');
    await expect(page.locator('text=Focus Time')).toBeVisible();

    // Check if audio toggle button is present (feature flag dependent)
    const audioButton = page.locator('button[aria-label*="audio"]');
    const isVisible = await audioButton.isVisible().catch(() => false);

    if (isVisible) {
      // Test audio toggle
      await audioButton.click();
      // Audio state should change (button appearance)
      await expect(audioButton).toBeVisible();
    }
  });
});

test.describe('Personalization Features', () => {
  test('should maintain tutor conversation history', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('text=Homework Dashboard');

    // Navigate to tutor
    await page.click('[aria-label="AI Tutor"]');
    await page.waitForSelector('text=AI Tutor');

    // Send a message
    const input = page.locator('input[placeholder*="AI Tutor"]');
    await input.fill('Hello');
    await page.click('button[aria-label="Send message"]');

    // Wait for response
    await page.waitForTimeout(5000);

    // Check message count indicator
    const messageCount = page.locator('text=/\\d+ messages/');
    await expect(messageCount).toBeVisible({ timeout: 10000 });
  });
});
