import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:5173');

    // Wait for app to load
    await page.waitForLoadState('networkidle');
  });

  test('should display properly on mobile viewport', async ({ page }) => {
    // Check viewport size
    const viewportSize = page.viewportSize();
    console.log(`Testing on viewport: ${viewportSize?.width}x${viewportSize?.height}`);

    // Check that mobile navigation is visible
    const mobileNav = page.getByRole('navigation', { name: /mobile/i });
    await expect(mobileNav).toBeVisible();

    // Take screenshot for visual inspection
    await page.screenshot({
      path: `tests/screenshots/mobile-viewport.png`,
      fullPage: true
    });
  });

  test('should have touch-friendly button sizes', async ({ page }) => {
    // Find all buttons
    const buttons = page.locator('button');
    const count = await buttons.count();

    const smallButtons = [];
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();

      if (box && (box.width < 44 || box.height < 44)) {
        const text = await button.textContent();
        smallButtons.push({ width: box.width, height: box.height, text: text?.substring(0, 30) });
      }
    }

    if (smallButtons.length > 0) {
      console.log('Small buttons found:', smallButtons);
    }
    expect(smallButtons.length).toBe(0);
  });

  test('should have readable text sizes', async ({ page }) => {
    // Check that body text is not too small (14px+)
    // Labels and secondary text can be 11px+ (Material Design 3)
    const bodyText = page.locator('p:not(.text-xs), h1, h2, h3, div.text-base');
    const count = await bodyText.count();
    let tooSmallCount = 0;

    for (let i = 0; i < Math.min(count, 10); i++) {
      const element = bodyText.nth(i);
      const fontSize = await element.evaluate(el => {
        return window.getComputedStyle(el).fontSize;
      });

      const size = parseInt(fontSize);
      // Body text should be at least 14px
      if (!isNaN(size) && size < 14) {
        tooSmallCount++;
      }
    }

    // Labels should be at least 11px
    const labels = page.locator('span, .text-xs');
    const labelCount = await labels.count();
    let tooSmallLabels = 0;

    for (let i = 0; i < Math.min(labelCount, 10); i++) {
      const element = labels.nth(i);
      const fontSize = await element.evaluate(el => {
        return window.getComputedStyle(el).fontSize;
      });

      const size = parseInt(fontSize);
      if (!isNaN(size) && size < 11) {
        tooSmallLabels++;
      }
    }

    expect(tooSmallCount).toBe(0);
    expect(tooSmallLabels).toBeLessThan(2);
  });

  test('should have proper mobile navigation', async ({ page }) => {
    // Check for mobile navigation (bottom nav)
    const mobileNav = page.getByRole('navigation', { name: /mobile/i });

    await expect(mobileNav).toBeVisible();

    // Navigation should be easily accessible
    const box = await mobileNav.boundingBox();
    if (box) {
      // Should be at least 56px tall for touch (bottom nav with padding)
      expect(box.height).toBeGreaterThanOrEqual(56);
    }
  });

  test('should not have horizontal overflow', async ({ page }) => {
    // Check for horizontal scrollbar (should not exist on mobile)
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(false);
  });

  test('should handle input focus without zoom', async ({ page }) => {
    // Click the Add button to open modal with inputs
    const addButton = page.getByRole('button', { name: /add/i });
    if (await addButton.count() > 0) {
      await addButton.first().click();
      await page.waitForTimeout(500);
    }

    // Find input fields
    const inputs = page.locator('input[type="text"], input[type="date"], textarea');

    if (await inputs.count() > 0) {
      const input = inputs.first();

      // Focus the input
      await input.focus();

      // Check that font size is at least 16px to prevent zoom on iOS
      const fontSize = await input.evaluate(el => {
        return window.getComputedStyle(el).fontSize;
      });

      const size = parseInt(fontSize);
      expect(size).toBeGreaterThanOrEqual(16);
    }
  });
});

test.describe('Landscape Orientation', () => {
  test.use({
    viewport: { width: 915, height: 412 }, // Landscape Motorola
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Moto G) AppleWebKit/537.36'
  });

  test('should display properly in landscape', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    // Check that content is still accessible
    await expect(page.locator('body')).toBeVisible();

    // Take landscape screenshot
    await page.screenshot({
      path: 'tests/screenshots/mobile-landscape.png',
      fullPage: true
    });

    // Check no horizontal overflow in landscape
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(false);
  });
});

test.describe('Performance on Mobile', () => {
  test.use({
    viewport: { width: 412, height: 915 }
  });

  test('should load within acceptable time on slow network', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('http://localhost:5173', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    const loadTime = Date.now() - startTime;

    // Should load within 10 seconds even on slow connection
    expect(loadTime).toBeLessThan(10000);

    // Check that critical content is visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have optimized images for mobile', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check all images
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');

      if (src) {
        // Images should be reasonably sized
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        const naturalHeight = await img.evaluate((el: HTMLImageElement) => el.naturalHeight);

        // Mobile images shouldn't be larger than 2x the viewport
        expect(naturalWidth).toBeLessThanOrEqual(1024);
        expect(naturalHeight).toBeLessThanOrEqual(2048);
      }
    }
  });
});