import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, userSettings } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { DEFAULT_USER_ID } from '@/lib/utils';

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;
const VALID_THEMES = ['light', 'dark', 'system'] as const;
type TargetLevel = (typeof VALID_LEVELS)[number];
type Theme = (typeof VALID_THEMES)[number];

export async function GET() {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, DEFAULT_USER_ID));
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, DEFAULT_USER_ID));

    return NextResponse.json({
      name: user?.name ?? 'Learner',
      targetLevel: user?.targetLevel ?? 'A1',
      theme: settings?.theme ?? 'system',
      focusMode: settings?.focusMode ?? false,
      dailyGoal: settings?.dailyGoal ?? 20,
    });
  } catch {
    return NextResponse.json({
      name: 'Learner',
      targetLevel: 'A1',
      theme: 'system',
      focusMode: false,
      dailyGoal: 20,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      targetLevel?: string;
      theme?: string;
      focusMode?: boolean;
      dailyGoal?: number;
    };

    const level = VALID_LEVELS.includes((body.targetLevel as TargetLevel) ?? ('' as TargetLevel))
      ? (body.targetLevel as TargetLevel)
      : undefined;

    const theme = VALID_THEMES.includes((body.theme as Theme) ?? ('' as Theme))
      ? (body.theme as Theme)
      : undefined;

    const dailyGoal =
      typeof body.dailyGoal === 'number' && body.dailyGoal >= 1 && body.dailyGoal <= 200
        ? body.dailyGoal
        : undefined;

    // Ensure user exists, upsert user
    await db
      .insert(users)
      .values({
        id: DEFAULT_USER_ID,
        name: body.name ?? 'Learner',
        targetLevel: (level ?? 'A1') as TargetLevel,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...(body.name != null ? { name: body.name } : {}),
          ...(level != null ? { targetLevel: level } : {}),
          updatedAt: new Date(),
        },
      });

    // Upsert userSettings
    const [existing] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, DEFAULT_USER_ID));

    if (existing) {
      await db
        .update(userSettings)
        .set({
          theme: theme ?? existing.theme,
          focusMode: body.focusMode ?? existing.focusMode,
          dailyGoal: dailyGoal ?? existing.dailyGoal,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.userId, DEFAULT_USER_ID));
    } else {
      await db.insert(userSettings).values({
        userId: DEFAULT_USER_ID,
        theme: theme ?? 'system',
        focusMode: body.focusMode ?? false,
        dailyGoal: dailyGoal ?? 20,
      });
    }

    const [user] = await db.select().from(users).where(eq(users.id, DEFAULT_USER_ID));
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, DEFAULT_USER_ID));

    return NextResponse.json({
      success: true,
      user: { name: user?.name, targetLevel: user?.targetLevel },
      settings: {
        theme: settings?.theme ?? 'system',
        focusMode: settings?.focusMode ?? false,
        dailyGoal: settings?.dailyGoal ?? 20,
      },
    });
  } catch (error) {
    console.error('Settings error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
