import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const [user] = await db
      .select({ xp: users.xp, level: users.level })
      .from(users)
      .where(eq(users.id, session.id));

    const xp = user?.xp ?? 0;
    const level = Math.floor(xp / 100) + 1;
    const xpInLevel = xp % 100;

    return NextResponse.json({ xp, level, xpInLevel, xpForNextLevel: 100 });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
