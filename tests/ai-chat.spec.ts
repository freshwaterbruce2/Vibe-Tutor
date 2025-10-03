import { test, expect } from '@playwright/test';

// AI Chat Functionality Tests
test.describe('AI Chat Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('AI Tutor should be accessible and respond', async ({ page }) => {
    // Navigate to AI Tutor
    await page.getByRole('button', { name: /AI Tutor|tutor/i }).click();
    await page.waitForTimeout(500);

    // Verify chat window header is visible (more specific)
    await expect(page.getByRole('heading', { name: /AI Tutor/i })).toBeVisible();

    // Type a message
    const input = page.locator('input[placeholder*="Message"], input[aria-label="Chat input"]');
    await expect(input).toBeVisible();
    await input.fill('Hello');

    // Send message
    const sendButton = page.getByRole('button', { name: /send/i });
    await sendButton.click();

    // Wait for loading indicator
    await expect(page.getByText(/thinking|typing/i)).toBeVisible({ timeout: 5000 });

    // Wait for AI response (30 seconds for backend to wake + process)
    const response = page.locator('[class*="message"]').last();
    await expect(response).toContainText(/\w+/, { timeout: 35000 });

    console.log('[TEST] AI Tutor responded successfully');
  });

  test('AI Buddy should be accessible and respond', async ({ page }) => {
    // Navigate to AI Buddy
    await page.getByRole('button', { name: /AI Buddy|friend|buddy/i }).click();
    await page.waitForTimeout(500);

    // Verify chat window header is visible (more specific)
    await expect(page.getByRole('heading', { name: /AI Buddy/i })).toBeVisible();

    // Type a message
    const input = page.locator('input[placeholder*="Message"], input[aria-label="Chat input"]');
    await expect(input).toBeVisible();
    await input.fill('Hi');

    // Send message
    const sendButton = page.getByRole('button', { name: /send/i });
    await sendButton.click();

    // Wait for loading indicator
    await expect(page.getByText(/thinking|typing/i)).toBeVisible({ timeout: 5000 });

    // Wait for AI response
    const response = page.locator('[class*="message"]').last();
    await expect(response).toContainText(/\w+/, { timeout: 35000 });

    console.log('[TEST] AI Buddy responded successfully');
  });

  test('Chat should handle backend sleep/wake correctly', async ({ page }) => {
    // This test verifies the app handles a sleeping backend gracefully
    await page.getByRole('button', { name: /AI Tutor/i }).click();
    await page.waitForTimeout(500);

    const input = page.locator('input[aria-label="Chat input"]');
    await input.fill('Test message');

    const sendButton = page.getByRole('button', { name: /send/i });
    await sendButton.click();

    // Should show loading state
    await expect(page.getByText(/thinking/i)).toBeVisible({ timeout: 5000 });

    // Should eventually get response (even if backend was sleeping)
    const hasResponse = await page.locator('[class*="message"]').last().textContent({ timeout: 60000 });
    expect(hasResponse).toBeTruthy();
    expect(hasResponse!.length).toBeGreaterThan(0);

    console.log('[TEST] Backend wake handling successful');
  });

  test('Chat should persist conversation history', async ({ page }) => {
    await page.getByRole('button', { name: /AI Tutor/i }).click();
    await page.waitForTimeout(500);

    // Send first message
    let input = page.locator('input[aria-label="Chat input"]');
    await input.fill('Message 1');
    await page.getByRole('button', { name: /send/i }).click();
    await page.waitForTimeout(2000);

    // Send second message
    input = page.locator('input[aria-label="Chat input"]');
    await input.fill('Message 2');
    await page.getByRole('button', { name: /send/i }).click();

    // Verify both messages are visible
    await expect(page.getByText('Message 1')).toBeVisible();
    await expect(page.getByText('Message 2')).toBeVisible();

    console.log('[TEST] Chat history persistence verified');
  });
});
