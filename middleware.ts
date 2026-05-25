import { clerkMiddleware,createRouteMatcher } from '@clerk/nextjs/server';


const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',"/","/about","/home", "/contact","/privacy-policy",
  '/sign-up(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const authObject = await auth();

  // if (authObject.userId && (pathname === '/' || pathname.startsWith('/sign-in'))) {
  //   return Response.redirect(new URL('/chat', req.url));
  // }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};