import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, userSettings } from '@/lib/schema';
import { eq, and, ne } from 'drizzle-orm';
import { getCurrentUserId } from '@/lib/get-user';

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;
const VALID_THEMES = [
  'system',
  'colorful',
  'neo-brutalist',
  'light',
  'dark',
] as const;
type TargetLevel = (typeof VALID_LEVELS)[number];
type Theme = (typeof VALID_THEMES)[number];

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));

    return NextResponse.json({
      id: user?.id ?? userId,
      username: user?.username ?? 'learner',
      name: user?.name ?? 'Learner',
      targetLevel: user?.targetLevel ?? 'A1',
      theme: settings?.theme ?? 'system',
      focusMode: settings?.focusMode ?? false,
      dailyGoal: settings?.dailyGoal ?? 20,
      soundEnabled: settings?.soundEnabled ?? true,
      hasPassword: !!user?.passwordHash,
      createdAt: user?.createdAt ?? null,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    return NextResponse.json({
      username: 'learner',
      name: 'Learner',
      targetLevel: 'A1',
      theme: 'system',
      focusMode: false,
      dailyGoal: 20,
      soundEnabled: true,
      hasPassword: false,
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const body = (await request.json()) as {
      username?: string;
      name?: string;
      targetLevel?: string;
      theme?: string;
      focusMode?: boolean;
      dailyGoal?: number;
      soundEnabled?: boolean;
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

    // Check if username is being changed and is already taken
    if (body.username) {
      const cleanUsername = body.username.toLowerCase().trim();
      if (cleanUsername.length < 3) {
        return NextResponse.json(
          { error: 'Username must be at least 3 characters long' },
          { status: 400 }
        );
      }

      const existing = await db
        .select()
        .from(users)
        .where(and(eq(users.username, cleanUsername), ne(users.id, userId)))
        .limit(1);

      if (existing.length > 0) {
        return NextResponse.json(
          { error: 'Username already taken by another account' },
          { status: 400 }
        );
      }
    }

    // Ensure user exists, upsert user
    await db
      .insert(users)
      .values({
        id: userId,
        username: body.username ? body.username.toLowerCase().trim() : 'learner',
        name: body.name ?? 'Learner',
        targetLevel: (level ?? 'A1') as TargetLevel,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...(body.username != null ? { username: body.username.toLowerCase().trim() } : {}),
          ...(body.name != null ? { name: body.name } : {}),
          ...(level != null ? { targetLevel: level } : {}),
          updatedAt: new Date(),
        },
      });

    // Upsert userSettings
    const [existing] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));

    if (existing) {
      await db
        .update(userSettings)
        .set({
          theme: theme ?? existing.theme,
          focusMode: body.focusMode ?? existing.focusMode,
          dailyGoal: dailyGoal ?? existing.dailyGoal,
          soundEnabled: body.soundEnabled ?? existing.soundEnabled,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.userId, userId));
    } else {
      await db.insert(userSettings).values({
        userId,
        theme: theme ?? 'system',
        focusMode: body.focusMode ?? false,
        dailyGoal: dailyGoal ?? 20,
        soundEnabled: body.soundEnabled ?? true,
      });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId));

    return NextResponse.json({
      success: true,
      user: {
        username: user?.username,
        name: user?.name,
        targetLevel: user?.targetLevel,
      },
      settings: {
        theme: settings?.theme ?? 'system',
        focusMode: settings?.focusMode ?? false,
        dailyGoal: settings?.dailyGoal ?? 20,
        soundEnabled: settings?.soundEnabled ?? true,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    console.error('Settings error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
