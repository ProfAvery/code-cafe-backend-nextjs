
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const cookieName = process.env.COOKIE_NAME;
const TWELVE_HOURS = 12 * 60 * 60 * 1000;

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set(cookieName, '', { maxAge: TWELVE_HOURS, httpOnly: true });
  return response;
}
