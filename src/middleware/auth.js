import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.SECRET);
const cookieName = process.env.COOKIE_NAME;

export const authMiddleware = (handler) => async (req, props) => {
  const cookie = req.cookies.get(cookieName)?.value;

  if (!cookie) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  try {
    const { payload } = await jwtVerify(cookie, secret, {
      algorithms: ['HS256'],
    });

    if (payload && payload.access === 'associate') {
      // The handler will have access to the request and props
      return handler(req, props);
    }
  } catch (err) {
    console.error('JWT Verification Error:', err);
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized: Invalid token' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  return new NextResponse(
    JSON.stringify({ error: 'Unauthorized: Insufficient permissions' }),
    { status: 403, headers: { 'content-type': 'application/json' } }
  );
};
