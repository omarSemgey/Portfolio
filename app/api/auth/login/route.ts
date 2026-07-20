import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (
      username !== process.env.DASHBOARD_USER ||
      password !== process.env.DASHBOARD_PASS
    ) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secret);

    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set('auth_token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      path: '/',
      maxAge: 7200,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Authentication routine failed' }, { status: 500 });
  }
}