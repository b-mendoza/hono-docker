import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

const port = Number.parseInt(process.env['PORT'] ?? '4000', 10);

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
