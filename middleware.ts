import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization');
  const user = process.env.BASIC_AUTH_USERNAME;
  const pass = process.env.BASIC_AUTH_PASSWORD;

  if (user && pass) {
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [inputUser, inputPass] = Buffer.from(authValue, 'base64').toString().split(':');
      if (inputUser === user && inputPass === pass) {
        return NextResponse.next();
      }
    }
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }
  return NextResponse.next();
} 