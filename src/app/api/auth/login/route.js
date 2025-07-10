
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';

const cookieName = process.env.COOKIE_NAME;
const secret = new TextEncoder().encode(process.env.SECRET);
const TWELVE_HOURS_IN_SECONDS = 12 * 60 * 60;

export async function POST(request) {
  const { username, password } = await request.json();

  if (username && password === 'pass') {
    const user = { access: ['guest', 'Guest'].includes(username) ? '' : 'associate', username };

    console.log(secret);
    const newToken = await new SignJWT(user)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(`${TWELVE_HOURS_IN_SECONDS}s`)
      .sign(secret);
    console.log(newToken);

    const response = NextResponse.json(user);
    response.cookies.set(cookieName, newToken, { maxAge: TWELVE_HOURS_IN_SECONDS, httpOnly: true });
    return response;
  } else {
    return NextResponse.json({ error: 'Incorrect Username or Password.' }, { status: 401 });
  }
}
