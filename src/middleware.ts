import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

const isHomePage = createRouteMatcher(['/'])


export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  const pathname = req.nextUrl.pathname;

  const hostname = req.headers.get("host")!;

  const subdomain = hostname.split(".")[0]; 


  if (!userId && !isPublicRoute(req) && !isHomePage(req)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (userId && isPublicRoute(req) && isHomePage(req)) {
    NextResponse.rewrite(new URL(`/${subdomain}`, req.url));
    return NextResponse.redirect(new URL(`/dashboard`, req.url));
  }

})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}