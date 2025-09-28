// apps/web/src/app/api/_auth/issue.ts
import { SignJWT } from "jose";

export async function issueBearer(sub: string) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);
  return await new SignJWT({ sub })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
}