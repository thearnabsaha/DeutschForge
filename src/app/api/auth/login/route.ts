import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const result = await login(username, password);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 401 });
    return NextResponse.json({ success: true, user: result.user });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
