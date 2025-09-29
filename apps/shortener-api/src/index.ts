// apps/shortener-api/src/index.ts
import 'dotenv/config';
import Fastify from 'fastify';
import { z } from 'zod';
import { prisma } from './db.js';
import { customAlphabet } from 'nanoid';
import { requireAuth } from './auth.js';

const app = Fastify();
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 7);

app.get('/health', async () => ({ ok: true, service: 'shortener-api' }));

const Body = z.object({
  url: z.string().url().refine((u) => {
    try { const p = new URL(u).protocol; return p === 'http:' || p === 'https:'; }
    catch { return false; }
  }, 'Only http/https URLs are allowed'),
});

app.post('/shorten', { preHandler: requireAuth }, async (req, reply) => {
  const parse = Body.safeParse(req.body);
  if (!parse.success) return reply.code(400).send({ ok: false, error: 'Invalid URL' });

  const userId = (req as any).auth.userId as string;
  const targetUrl = parse.data.url;

  for (let i = 0; i < 5; i++) {
    try {
      const row = await prisma.url.create({
        data: { shortCode: nanoid(), targetUrl, userId },
        select: { shortCode: true, targetUrl: true, createdAt: true },
      });
      return reply.send({ ok: true, ...row });
    } catch (e: any) {
      if (e?.code === 'P2002') continue;
      throw e;
    }
  }
  return reply.code(500).send({ ok: false, error: 'Collision loop, try again' });
});

app.get('/urls', { preHandler: requireAuth }, async (req) => {
  const userId = (req as any).auth.userId as string;
  const urls = await prisma.url.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { shortCode: true, targetUrl: true, createdAt: true },
  });
  return { ok: true, urls };
});

const PORT = Number(process.env.PORT || 4060);
app.listen({ port: PORT, host: '::' }).then(() => {
  console.log(`shortener-api listening on http://0.0.0.0:${PORT}`);
});

app.get('/debug/url-count', async () => ({ count: await prisma.url.count() }));