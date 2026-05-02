import { clerkMiddleware } from "@clerk/nextjs/server";

// Standard Clerk session token checker intercepting all page routing requests
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internal paths and standard assets, except matching queries
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Protect api / trpc routes
    "/(api|trpc)(.*)",
  ],
};
