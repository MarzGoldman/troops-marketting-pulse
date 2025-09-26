// apps/redirect-service/src/index.ts
import 'dotenv/config';
import Fastify from 'fastify';
import { prisma } from './db';

const app = Fastify();

app.get('/health', async () => ({ ok: true, service: 'redirect-service' }));

// 301 redirect + fire-and-forget click record
app.get('/:code', async (req, reply) => {
  const code = (req.params as any).code as string;
  if (!code) return reply.code(400).send({ ok: false, error: 'Missing code' });

  const url = await prisma.url.findUnique({
    where: { shortCode: code },
    select: { id: true, targetUrl: true },
  });
  if (!url) return reply.code(404).send({ ok: false, error: 'Not found' });

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip;
  const userAgent = req.headers['user-agent'];
  const referer = req.headers['referer'];

  prisma.click
    .create({
      data: { urlId: url.id, ip, userAgent, referer },
    })
    .catch(() => {});

  return reply.redirect(301, url.targetUrl);
});

// NEW: stats endpoint
app.get('/stats/:code', async (req, reply) => {
  const code = (req.params as any).code as string;
  if (!code) return reply.code(400).send({ ok: false, error: 'Missing code' });

  const url = await prisma.url.findUnique({
    where: { shortCode: code },
    select: {
      shortCode: true,
      targetUrl: true,
      createdAt: true,
      _count: { select: { clicks: true } },
    },
  });

  if (!url) return reply.code(404).send({ ok: false, error: 'Not found' });

  return reply.send({
    ok: true,
    code: url.shortCode,
    target: url.targetUrl,
    createdAt: url.createdAt,
    clicks: url._count.clicks,
  });
});

const PORT = Number(process.env.PORT || 4070);
app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  console.log(`redirect-service listening on http://localhost:${PORT}`);
});