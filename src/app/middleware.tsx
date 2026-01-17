import {NextFetchEvent, NextRequest, NextResponse} from 'next/server'
import {defaultLang, isValidLang} from '@/lib/i18n'



export async function middleware(req: NextRequest, event: NextFetchEvent) {

  const {pathname} = req.nextUrl



  if (req.method !== 'GET') {
    return NextResponse.next()
  }
  if (
    pathname.includes('..') ||
    pathname.includes('.env') ||
    pathname.startsWith('/.')
  ) {
    return new NextResponse('Not Found', {status: 404})
  }

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(`/${defaultLang}`, req.url)
    )
  }

  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (firstSegment && isValidLang(firstSegment)) {
    return NextResponse.next()
  }

  return NextResponse.rewrite(
    new URL(`/${defaultLang}${pathname}`, req.url)
  )
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
}
