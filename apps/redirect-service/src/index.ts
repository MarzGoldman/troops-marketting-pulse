// apps/redirect-service/src/index.ts
import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { prisma } from './db.js';
import { createRequire } from 'module';

// CJS interop for ua-parser-js
const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const UAParser = require('ua-parser-js') as any;

const app = Fastify();

// --- CORS (dev: allow all; prod: restrict) ---
const ALLOW_ORIGIN =
  process.env.ALLOW_ORIGIN?.split(',').map(s => s.trim()).filter(Boolean) ?? true;
// true = reflect request origin (dev). Or set ALLOW_ORIGIN="http://localhost:3000,https://yourdomain.com"
app.register(cors, { origin: ALLOW_ORIGIN });

// health
app.get('/health', async () => ({ ok: true, service: 'redirect-service' }));

// 301 redirect + analytics
app.get('/:code', async (req, reply) => {
  const code = (req.params as any).code as string;
  if (!code) return reply.code(400).send({ ok: false, error: 'Missing code' });

  const url = await prisma.url.findFirst({
    where: { shortCode: { equals: code, mode: 'insensitive' } },
    select: { id: true, targetUrl: true },
  });
  if (!url) return reply.code(404).send({ ok: false, error: 'Not found' });

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip;
  const userAgent = req.headers['user-agent'] ?? undefined;
  const referer = req.headers['referer'] ?? undefined;

  // UA parse + basic bot detection
  const parsed = new UAParser(userAgent).getResult();
  const deviceType = parsed?.device?.type ?? 'desktop';
  const browser = parsed?.browser?.name ?? null;
  const os = parsed?.os?.name ?? null;
  const isBot = !!(userAgent && /bot|crawl|spider|slurp|facebookexternalhit|discordbot|whatsapp|telegram|curl|wget/i.test(userAgent));

  // Await while stabilising (can switch to fire-and-forget later)
  try {
    await prisma.click.create({
      data: { urlId: url.id, ip, userAgent, referer, deviceType, browser, os, isBot },
    });
  } catch (e) {
    console.error('click-create failed:', (e as any)?.message || e);
  }

  return reply.redirect(301, url.targetUrl);
});

// stats (totals)
app.get('/stats/:code', async (req, reply) => {
  const code = (req.params as any).code as string;
  if (!code) return reply.code(400).send({ ok: false, error: 'Missing code' });

  const row = await prisma.url.findFirst({
    where: { shortCode: { equals: code, mode: 'insensitive' } },
    select: {
      shortCode: true,
      targetUrl: true,
      createdAt: true,
      _count: { select: { clicks: true } },
    },
  });
  if (!row) return reply.code(404).send({ ok: false, error: 'Not found' });

  return reply.send({
    ok: true,
    code: row.shortCode,
    target: row.targetUrl,
    createdAt: row.createdAt,
    clicks: row._count.clicks,
  });
});

const PORT = Number(process.env.PORT || 8080);
app.listen({ port: PORT, host: '::' }).then(() => {
  console.log(`redirect-service listening on http://0.0.0.0:${PORT}`);
});

app.get('/debug/url-count', async () => ({ count: await prisma.url.count() }));