
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const cookieName = process.env.COOKIE_NAME || 'coffeeJWT';
const secret = process.env.JWT_SECRET || 'bnr-secret-sauce';

export async function GET() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(cookieName);

  if (cookie) {
    try {
      const user = jwt.verify(cookie.value, secret, { algorithm: 'HS256' });
      return NextResponse.json(user);
    } catch (error) {
      return NextResponse.json({});
    }
  } else {
    return NextResponse.json({});
  }
}
