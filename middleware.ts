import { NextResponse, type NextRequest } from 'next/server';

import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const previousPage = req.nextUrl.pathname;
  const validRoles = ['admin', 'super-user', 'SEO'];
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (previousPage.startsWith('/checkout')) {
    // const token = req.cookies.get('token')?.value;
    // if (!token) {
    // return NextResponse.redirect(
    //   new URL(`/auth/login?p=${previousPage}`, req.url)
    // );
    // }
    // try {
    //   await jwtVerify(
    //     token,
    //     new TextEncoder().encode(process.env.JWT_SECRET_SEED)
    //   );
    //   return NextResponse.next();
    // } catch (error) {
    //   return NextResponse.redirect(
    //     new URL(`/auth/login?p=${previousPage}`, req.url)
    //   );
    // }

    if (!session) {
      return NextResponse.redirect(
        new URL(`/auth/login?p=${previousPage}`, req.url)
      );
    }

    return NextResponse.next();
  }

  if (previousPage.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(
        new URL(`/auth/login?p=${previousPage}`, req.url)
      );
    }

    if (!validRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  }

  if (
    previousPage.includes('/api/admin') &&
    !validRoles.includes(session.user.role)
  ) {
    return new Response(JSON.stringify({ message: 'No autorizado' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
