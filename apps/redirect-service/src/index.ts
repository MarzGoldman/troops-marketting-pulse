// apps/redirect-service/src/index.ts
import 'dotenv/config';
import Fastify from 'fastify';
import { prisma } from './db';
import { createRequire } from 'module';

// CJS interop for ua-parser-js
const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const UAParser = require('ua-parser-js') as any;

const app = Fastify();

app.get('/health', async () => ({ ok: true, service: 'redirect-service' }));

app.get('/:code', async (req, reply) => {
  const code = (req.params as any).code as string;
  if (!code) return reply.code(400).send({ ok: false, error: 'Missing code' });

  const url = await prisma.url.findUnique({
    where: { shortCode: code },
    select: { id: true, targetUrl: true },
  });
  if (!url) return reply.code(404).send({ ok: false, error: 'Not found' });

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip;
  const userAgent = req.headers['user-agent'] ?? undefined;
  const referer = req.headers['referer'] ?? undefined;

  // use as a constructor
  const parsed = new UAParser(userAgent).getResult();
  const deviceType = parsed?.device?.type ?? 'desktop';
  const browser = parsed?.browser?.name ?? null;
  const os = parsed?.os?.name ?? null;
  const isBot = !!(userAgent && /bot|crawl|spider|slurp|facebookexternalhit|discordbot|whatsapp|telegram|curl|wget/i.test(userAgent));

  prisma.click.create({
    data: { urlId: url.id, ip, userAgent, referer, deviceType, browser, os, isBot },
  }).catch(() => {});

  return reply.redirect(301, url.targetUrl);
});

app.get('/stats/:code', async (req, reply) => {
  const code = (req.params as any).code as string;
  if (!code) return reply.code(400).send({ ok: false, error: 'Missing code' });

  const row = await prisma.url.findUnique({
    where: { shortCode: code },
    select: { shortCode: true, targetUrl: true, createdAt: true, _count: { select: { clicks: true } } },
  });
  if (!row) return reply.code(404).send({ ok: false, error: 'Not found' });

  return reply.send({ ok: true, code: row.shortCode, target: row.targetUrl, createdAt: row.createdAt, clicks: row._count.clicks });
});

const PORT = Number(process.env.PORT || 4070);
app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  console.log(`redirect-service listening on http://localhost:${PORT}`);
});