import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'deutschforge-secret-key-change-in-production');
export const COOKIE_NAME = 'df-session';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
};

export interface SessionUser {
  id: string;
  username: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(user: SessionUser): Promise<string> {
  return new SignJWT({ userId: user.id, username: user.username, name: user.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.userId as string,
      username: payload.username as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function signup(
  username: string,
  password: string,
  name?: string
): Promise<{ success: boolean; error?: string; user?: SessionUser; token?: string }> {
  if (!username || username.length < 3) return { success: false, error: 'Username must be at least 3 characters' };
  if (!password || password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.username, username.toLowerCase().trim()))
    .limit(1);
  if (existing.length > 0) return { success: false, error: 'Username already taken' };

  const hash = await hashPassword(password);
  const [newUser] = await db
    .insert(users)
    .values({
      username: username.toLowerCase().trim(),
      passwordHash: hash,
      name: name || username,
    })
    .returning();

  if (!newUser) return { success: false, error: 'Failed to create user' };

  const sessionUser: SessionUser = { id: newUser.id, username: newUser.username, name: newUser.name };
  const token = await createToken(sessionUser);
  return { success: true, user: sessionUser, token };
}

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: SessionUser; token?: string }> {
  if (!username || !password) return { success: false, error: 'Username and password required' };

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username.toLowerCase().trim()))
    .limit(1);
  if (!user || !user.passwordHash) return { success: false, error: 'Invalid username or password' };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { success: false, error: 'Invalid username or password' };

  const sessionUser: SessionUser = { id: user.id, username: user.username, name: user.name };
  const token = await createToken(sessionUser);
  return { success: true, user: sessionUser, token };
}
