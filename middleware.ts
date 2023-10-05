import { NextResponse, type NextRequest } from 'next/server';

import { jwtVerify } from 'jose';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const previousPage = req.nextUrl.pathname;

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

    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!session) {
      return NextResponse.redirect(
        new URL(`/auth/login?p=${previousPage}`, req.url)
      );
    }

    return NextResponse.next();
  }
}
