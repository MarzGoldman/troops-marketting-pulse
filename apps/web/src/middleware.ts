// apps/web/src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtected = createRouteMatcher(["/", "/links(.*)", "/api/shorten", "/api/urls"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect(); // redirects to sign-in if not authenticated
  }
});

export const config = { matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/api/(.*)"] };