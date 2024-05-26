const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://raymondng117.github.io/portfolio-page/#';

test('Navigation Test', async ({ page }) => {
  await page.goto(BASE_URL);
  
  await page.click('text=ABOUT');
  await page.waitForURL(`${BASE_URL}/about`);

  await page.click('text=PROJECTS');
  await page.waitForURL(`${BASE_URL}/projects`);

  await page.click('text=RESUME');
  await page.waitForURL(`${BASE_URL}/resume`);

  await page.click('text=CONTACT');
  await page.waitForURL(`${BASE_URL}/contact`);

  expect(page.url()).toBe(`${BASE_URL}/contact`);
});

test('Navbar Visibility Test', async ({ page }) => {
  await page.goto(BASE_URL);

  const navBar = page.locator('.nav-bar-container');
  await expect(navBar).toHaveClass(/navbar-hidden/);
  await page.hover('.navbar-brand');

 
  await expect(navBar).toHaveClass(/navbar-visible/);

  await page.waitForTimeout(4000);
  await expect(navBar).toHaveClass(/navbar-hidden/);
});

test('Button Click Test', async ({ page }) => {
  await page.goto(BASE_URL);

  // Click on live demo button of the first project card
  const [newPage] = await Promise.all([
    page.waitForPopup(),
    page.click('.projects-col:first-child .btn-secondary:nth-child(1)')
  ]);

  // Check if page navigates to the correct live demo URL
  await newPage.waitForLoadState();
  expect(newPage.url()).toBe('https://raymondng117.github.io/react-todo-app-static/');
});


test('Content Visibility Test', async ({ page }) => {
  await page.goto(`${BASE_URL}/projects`);

  // Check if project cards are visible
  const projectCards = await page.$$('.projects-container');
  expect(projectCards.length).toBeGreaterThan(0);
});
