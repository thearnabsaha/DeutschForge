import { NextRequest, NextResponse } from 'next/server';
import { signup } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password, name } = await req.json();
    const result = await signup(username, password, name);
    if (!result.success) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true, user: result.user });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
