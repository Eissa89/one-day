import { test, expect } from '@playwright/test';

test.describe('ONE DAY — Comprehensive Web Experience Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('01. First launch displays Intro screen correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('ONE DAY');
    await expect(page.getByText('ONE CRIME. ONE DAY. ONE CHANCE.')).toBeVisible();
    await expect(page.getByText('You are entering a fictional psychological simulation.')).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/01-intro-screen.png' });
  });

  test('02. Enter Case -> Accept Fate -> Pursuit Interface Flow', async ({ page }) => {
    await page.getByRole('button', { name: 'ENTER THE CASE' }).click();

    await expect(page.getByText('STATUS: ACTIVE')).toBeVisible();
    await expect(page.getByText('CURRENT PENALTY: ×1')).toBeVisible();
    await expect(page.getByText('RECOVERED EVIDENCE FILES (DRAFT 0)')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/02-case-screen.png' });

    await page.getByRole('button', { name: 'ACCEPT YOUR FATE' }).click();

    await expect(page.getByText('COMMAND CENTER')).toBeVisible();
    await expect(page.getByText('TIME REMAINING')).toBeVisible();
    await expect(page.getByText('HEAT', { exact: true })).toBeVisible();
    await expect(page.getByText('ACTIVE PURSUIT')).toBeVisible();

    // Verify Case #001 Major Decision
    await expect(page.getByText('MAJOR DECISION — 23:30 DEADLINE APPROACHING')).toBeVisible();
    await page.getByRole('button', { name: 'OPTION A — CONFRONT NOW' }).click();
    await expect(page.getByText('CONSEQUENCE BRANCH:')).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/03-pursuit-screen.png' });
  });

  test('03. Timer persists after page refresh', async ({ page }) => {
    await page.getByRole('button', { name: 'ENTER THE CASE' }).click();
    await page.getByRole('button', { name: 'ACCEPT YOUR FATE' }).click();

    await expect(page.getByText('COMMAND CENTER')).toBeVisible();

    await page.reload();

    await expect(page.getByText('COMMAND CENTER')).toBeVisible();
    await expect(page.getByText('TIME REMAINING')).toBeVisible();
  });

  test('04. Dev Mode Forced CAUGHT doubles penalty multiplier', async ({ page }) => {
    await page.getByRole('button', { name: 'ENTER THE CASE' }).click();
    await page.getByRole('button', { name: 'ACCEPT YOUR FATE' }).click();

    await expect(page.getByText('COMMAND CENTER')).toBeVisible();
    await page.getByRole('button', { name: 'FORCE CAUGHT' }).click();

    await expect(page.getByRole('heading', { name: 'CAUGHT' })).toBeVisible();
    await expect(page.getByText('FINAL PENALTY')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/04-caught-screen.png' });
  });

  test('05. Dev Mode Forced ESCAPED resolves record entry', async ({ page }) => {
    await page.getByRole('button', { name: 'ENTER THE CASE' }).click();
    await page.getByRole('button', { name: 'ACCEPT YOUR FATE' }).click();

    await expect(page.getByText('COMMAND CENTER')).toBeVisible();
    await page.getByRole('button', { name: 'FORCE ESCAPED' }).click();

    await expect(page.getByRole('heading', { name: 'ESCAPED' })).toBeVisible();
    await expect(page.getByText('YOU GOT AWAY.')).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/05-escaped-screen.png' });
  });

  test('06. Full Progression to ZERO DAYS REMAINING VICTORY', async ({ page }) => {
    await page.getByRole('button', { name: 'ENTER THE CASE' }).click();

    // Resolve 5 active record entries
    for (let i = 0; i < 5; i++) {
      await expect(page.getByRole('button', { name: 'ACCEPT YOUR FATE' })).toBeVisible();
      await page.getByRole('button', { name: 'ACCEPT YOUR FATE' }).click();

      await expect(page.getByText('COMMAND CENTER')).toBeVisible();

      await expect(page.getByRole('button', { name: 'FORCE ESCAPED' })).toBeVisible();
      await page.getByRole('button', { name: 'FORCE ESCAPED' }).click();

      if (i < 4) {
        await expect(page.getByRole('button', { name: 'NEXT DAY' })).toBeVisible();
        await page.getByRole('button', { name: 'NEXT DAY' }).click();
      }
    }

    await expect(page.getByRole('heading', { name: 'ZERO DAYS REMAINING' })).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/06-victory-screen.png' });
  });

  test('07. Bilingual Support (EN -> AR RTL toggle)', async ({ page }) => {
    const arabicBtn = page.getByText('العربية');
    await arabicBtn.click();

    const dir = await page.getAttribute('html', 'dir');
    expect(dir).toBe('rtl');

    await expect(page.getByText('يوم واحد').first()).toBeVisible();
    await page.screenshot({ path: 'tests/screenshots/07-arabic-rtl-screen.png' });

    const englishBtn = page.getByText('English');
    await englishBtn.click();
    const dirEn = await page.getAttribute('html', 'dir');
    expect(dirEn).toBe('ltr');
  });

  test('08. Responsive layout & No horizontal overflow on mobile viewports', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },
      { width: 375, height: 667 },
      { width: 390, height: 844 },
      { width: 768, height: 1024 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.reload();

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    }

    await page.screenshot({ path: 'tests/screenshots/08-mobile-375px.png' });
  });
});
