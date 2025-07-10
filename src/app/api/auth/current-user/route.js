
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

const cookieName = process.env.COOKIE_NAME;
const secret = new TextEncoder().encode(process.env.SECRET);

export async function GET() {
  const cookieStore = cookies();
  const cookie = cookieStore.get(cookieName);

  if (cookie) {
    try {
      const { payload: user } = await jwtVerify(cookie.value, secret, { algorithms: ['HS256'] });
      return NextResponse.json(user);
    } catch (error) {
      return NextResponse.json({});
    }
  } else {
    return NextResponse.json({});
  }
}
