import Fastify from 'fastify';

const app = Fastify();

app.get('/health', async () => ({ ok: true, service: 'redirect-service' }));

// placeholder for GET /:code (Chapter 4)

const PORT = Number(process.env.PORT || 4070);
app.listen({ port: PORT, host: '0.0.0.0' }).then(() => {
  console.log(`redirect-service listening on http://localhost:${PORT}`);
});
