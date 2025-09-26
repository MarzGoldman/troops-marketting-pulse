// apps/shortener-api/src/index.ts
import 'dotenv/config';
import Fastify from 'fastify';
import { z } from 'zod';
import { prisma } from './db';
import { customAlphabet } from 'nanoid';

const app = Fastify();
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 7);

app.get('/health', async () => ({ ok: true, service: 'shortener-api' }));

const Body = z.object({ url: z.string().url() });

app.post('/shorten', async (req, reply) => {
  const parse = Body.safeParse(req.body);
  if (!parse.success) {
    return reply.code(400).send({ ok: false, error: 'Invalid URL' });
  }
  const targetUrl = parse.data.url;

  // try a few times in case of rare collisions
  let shortCode = '';
  for (let i = 0; i < 5; i++) {
    try {
      shortCode = nanoid();
      const row = await prisma.url.create({
        data: { shortCode, targetUrl },
        select: { shortCode: true, targetUrl: true, createdAt: true },
      });
      return reply.send({ ok: true, ...row });
    } catch (e: any) {
      if (e.code === 'P2002') continue; // unique constraint violation → retry
      throw e;
    }
  }
  return reply.code(500).send({ ok: false, error: 'Collision loop, try again' });
});

const PORT = Number(process.env.PORT || 4060);
app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  console.log(`shortener-api listening on http://localhost:${PORT}`);
});