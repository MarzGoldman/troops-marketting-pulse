// apps/web/src/app/api/_auth/issue.ts
import { SignJWT } from "jose";

const AUTH_SECRET = process.env.AUTH_SECRET!;
const key = new TextEncoder().encode(AUTH_SECRET);

export async function issueBearer(userId: string) {
  // HS256 JWT with userId in `sub`
  return await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(key);
}