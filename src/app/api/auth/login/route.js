
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const cookieName = process.env.COOKIE_NAME || 'coffeeJWT';
const secret = process.env.JWT_SECRET || 'bnr-secret-sauce';
const TWELVE_HOURS = 12 * 60 * 60 * 1000;

export async function POST(request) {
  const { username, password } = await request.json();

  if (username && password === 'pass') {
    const user = { access: ['guest', 'Guest'].includes(username) ? '' : 'associate', username };
    console.log(secret);
    const newToken = jwt.sign(user, secret, { algorithm: 'HS256' });
    console.log(newToken);
    const response = NextResponse.json(user);
    response.cookies.set(cookieName, newToken, { maxAge: TWELVE_HOURS, httpOnly: true });
    return response;
  } else {
    return NextResponse.json({ error: 'Incorrect Username or Password.' }, { status: 401 });
  }
}
