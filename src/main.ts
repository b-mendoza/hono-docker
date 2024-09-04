// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// import UserAgent from 'user-agents';

import type { HttpBindings } from '@hono/node-server';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { isbot } from 'isbot';
import * as http from 'node:http';
import { chromium } from 'playwright';
import { addExtra } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

type HonoBindings = HttpBindings & {};

const app = new Hono<{
  Bindings: HonoBindings;
}>();

const PORT = Number.parseInt(process.env['PORT'] ?? '3000', 10);

app.get('/', async (c) => {
  const { default: UserAgent } = await import('user-agents');

  const userAgent = new UserAgent({
    deviceCategory: 'desktop',
  });

  const userAgentValue = userAgent.toString();

  if (isbot(userAgentValue)) {
    throw new Error(
      'Generated User Agent was identified as a bot. Please use a different User Agent.',
    );
  }

  const chromiumWithExtra = addExtra(chromium);

  // const { default: StealthPlugin } = await import(
  //   'puppeteer-extra-plugin-stealth'
  // );

  chromiumWithExtra.use(StealthPlugin());

  const browser = await chromiumWithExtra.launch({
    // headless: process.env['NODE_ENV'] === 'production',

    headless: true,
    slowMo: 500,
  });

  const browserContext = await browser.newContext({
    userAgent: userAgentValue,
    viewport: {
      height: 1080,
      width: 1920,
    },
    // proxy: {
    //   password: 'mvqzmua70clw',
    //   server: 'http://brd.superproxy.io:22225',
    //   username: 'brd-customer-hl_fbba4a56-zone-melonook_datacenter',
    // },
    // javaScriptEnabled: false,
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

// @ts-expect-error -- Hono's `serve` function is using a union type for the `serve` function, not a generic
const server: http.Server = serve({
  createServer: http.createServer,
  fetch: app.fetch,
  port: PORT,
});

server.on('listening', () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});
