import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const referer = req.headers.get('referer');

  if (pathname === '/sign-up/info') {
    if (!referer || !referer.includes(`${req.nextUrl.origin}/sign-up/terms`)) {
      return NextResponse.redirect(new URL('/sign-up/terms', req.url));
    }
  }

  if (pathname === '/club/create/campus/detail') {
    if (!referer || !referer.includes(`${req.nextUrl.origin}/club/create/campus/info`)) {
      return NextResponse.redirect(new URL('/club/create/campus/info', req.url));
    }
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/club/my', req.url));
  }

  return NextResponse.next();
}
