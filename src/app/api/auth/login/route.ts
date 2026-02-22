import { NextRequest, NextResponse } from 'next/server';
import { login, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
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
