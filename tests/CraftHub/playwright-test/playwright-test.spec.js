const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://terribly-content-mako.ngrok-free.app';

test.describe('CraftHub UI Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept all requests to add the ngrok-skip-browser-warning header
    await page.route('**/*', route => {
      const headers = {
        ...route.request().headers(),
        'ngrok-skip-browser-warning': 'true',
      };
      route.continue({ headers });
    });
  });

  // Navigation Testing
  test('Landing Page Navigation Test', async ({ page }) => {
    // Log console errors to detect any JavaScript issues
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`Error text: "${msg.text()}"`);
      }
    });

    await page.goto(BASE_URL);
    await expect(page).toHaveTitle('Craft Hub - Home');
    // Ensure page is fully loaded
    await page.waitForLoadState('networkidle');

    const cardContainer = page.locator('.container');
    await cardContainer.waitFor({ state: 'visible', timeout: 60000 });

    const woodworkingLink = page.locator('a[href*="Woodworking"] div.card__img--hover').first();
    // Use isVisible function to check if the link element is ready 
    console.log('Woodworking link div is visible:', await woodworkingLink.isVisible());

    // Debug why it's hidden if it's not visible
    if (!(await woodworkingLink.isVisible())) {
      console.log('Woodworking link div HTML:', await woodworkingLink.evaluate(el => el.outerHTML));
    }

    // Attempt to wait for visibility and click the inner div
    await woodworkingLink.waitFor({ state: 'visible', timeout: 60000 });  // Increased timeout
    await woodworkingLink.click();

    // Test navigation to Woodworking category
    await expect(page).toHaveURL(`${BASE_URL}/products/Woodworking/`);
    await expect(page.locator('h1')).toHaveText('Woodworking');

    // Capture a full page screenshot for debugging
    await page.screenshot({ path: 'Woodworking-Category.png', fullPage: true });
  });

  // Product details page testing
  test('Product details page testing', async ({ page }) => {
    await page.goto(`${BASE_URL}/products/Woodworking/`);
    await page.waitForLoadState('networkidle');

    const productsWrapper = page.locator('.wrapper');
    await productsWrapper.waitFor({ state: 'visible', timeout: 60000 });
    console.log('ProductsWrapper link div is visible:', await productsWrapper.isVisible());
    await expect(page.locator('h1')).toHaveText('Woodworking');

    const productLink = page.locator('a.product-card-link[href="/products/product/1/"]');
    await productLink.waitFor({ state: 'visible', timeout: 60000 });
    console.log('Product link is visible:', await productLink.isVisible());
    await productLink.click();

    await expect(page).toHaveURL(`${BASE_URL}/products/product/1/`);
    const title = await page.title();
    expect(title).toContain('Product Details');

    await page.screenshot({ path: 'Product-details.png', fullPage: true });
  });

  


});
