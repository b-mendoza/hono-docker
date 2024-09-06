import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { isbot } from 'isbot';
import { chromium } from 'playwright';
// import { addExtra } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import UserAgent from 'user-agents';

const app = new Hono();

app.get('/', async (c) => {
  // const { default: UserAgent } = await import('user-agents');

  const userAgent = new UserAgent({
    deviceCategory: 'desktop',
  });

  const userAgentValue = userAgent.toString();

  if (isbot(userAgentValue)) {
    throw new Error(
      'Generated User Agent was identified as a bot. Please use a different User Agent.',
    );
  }

  // const { chromium } = await import('playwright');

  const { chromium } = await import('playwright-extra');
  // const { chromium } = await import('playwright-extra');

  // const chromiumWithExtra = addExtra(chromium);

  // const { default: StealthPlugin } = await import(
  //   'puppeteer-extra-plugin-stealth'
  // );

  const browser = await chromium.use(StealthPlugin()).launch({
    // const browser = await chromium.launch({
    headless: process.env['NODE_ENV'] === 'production',
    slowMo: 500,
  });

  const browserContext = await browser.newContext({
    userAgent: userAgentValue,
    viewport: {
      height: 1080,
      width: 1920,
    },
  });

  const page = await browserContext.newPage();

  await page.goto('https://playwright.dev/');

  const titleLocator = page.getByRole('heading', {
    level: 1,
  });

  const titleTextContent = await titleLocator.textContent();

  await browserContext.close();

  await browser.close();

  return c.json({
    pageTitle: titleTextContent,
  });
});

const port = Number.parseInt(process.env['PORT'] ?? '4000', 10);

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
