// apps/shortener-api/src/auth.ts
import { jwtVerify } from "jose";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function requireAuth(req: any, reply: any) {
  const raw = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!raw) return reply.code(401).send({ ok: false, error: "missing_bearer" });
  try {
    const { payload } = await jwtVerify(raw, secret);
    (req as any).auth = { userId: String(payload.sub) };
  } catch {
    return reply.code(401).send({ ok: false, error: "invalid_token" });
  }
}