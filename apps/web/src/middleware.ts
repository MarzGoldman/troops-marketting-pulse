// apps/web/src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protect app pages + the API routes that talk to your Fastify API
const isProtected = createRouteMatcher([
  "/",
  "/links(.*)",
  "/api/shorten",
  "/api/urls",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect(); // redirect to /sign-in if not authenticated
  }
});

// Let static assets/_next pass through; run on API + app routes
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/api/(.*)",
  ],
};