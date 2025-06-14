import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  try {
    if (!SUPABASE_JWT_SECRET) throw new Error('Missing SUPABASE_JWT_SECRET env variable');
    await jwtVerify(token, new TextEncoder().encode(SUPABASE_JWT_SECRET));
    // Optionally, you can attach user info to the request here
    return NextResponse.next();
  } catch (e) {
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/:path*'],
}; 