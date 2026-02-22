import { NextRequest, NextResponse } from 'next/server';
import { signup, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password, name } = await req.json();
    const result = await signup(username, password, name);

    if (!result.success || !result.token) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const res = NextResponse.json({ success: true, user: result.user });
    res.cookies.set(COOKIE_NAME, result.token, COOKIE_OPTIONS);
    return res;
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
