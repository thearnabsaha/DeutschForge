import { NextRequest, NextResponse } from 'next/server';
import { login, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 login attempts per minute per IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const { allowed, resetIn } = checkRateLimit(`login:${ip}`, 5, 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${resetIn} seconds.` },
        { status: 429 }
      );
    }

    const { username, password } = await req.json();
    const result = await login(username, password);

    if (!result.success || !result.token) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const res = NextResponse.json({ success: true, user: result.user });
    res.cookies.set(COOKIE_NAME, result.token, COOKIE_OPTIONS);
    return res;
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
