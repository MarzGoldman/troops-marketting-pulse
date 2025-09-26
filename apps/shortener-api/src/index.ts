import Fastify from 'fastify';

const app = Fastify();

app.get('/health', async () => ({ ok: true, service: 'shortener-api' }));

// placeholder for POST /shorten (Chapter 3)
app.post('/shorten', async () => ({ todo: 'implement' }));

const PORT = Number(process.env.PORT || 4060);
app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  console.log(`shortener-api listening on http://localhost:${PORT}`);
});
