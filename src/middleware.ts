import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isHomePage = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If the user is authenticated and tries to access a public route, redirect them to the dashboard
  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL(`/dashboard`, req.url));
  }

  // If the user is not authenticated and tries to access a restricted page (not the home or public routes), redirect to sign-in
  if (!userId && !isPublicRoute(req) && !isHomePage(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // If the user is not authenticated and visiting the homepage, allow it (no redirect needed)
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
