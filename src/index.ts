// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// import UserAgent from 'user-agents';

import type { HttpBindings } from '@hono/node-server';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { isbot } from 'isbot';
import { chromium } from 'playwright';
import { addExtra } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import UserAgent from 'user-agents';

console.log(StealthPlugin().availableEvasions);

const PORT = Number.parseInt(process.env['PORT'] ?? '3000', 10);

const chromiumWithExtra = addExtra(chromium);

chromiumWithExtra.use(StealthPlugin());

type HonoBindings = HttpBindings & {};

const app = new Hono<{
  Bindings: HonoBindings;
}>();

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

  const browser = await chromiumWithExtra.launch({
    headless: true,
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

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`Server is listening on port http://localhost:${info.port}`);
  },
);
