import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'deutschforge-secret-key-change-in-production');
const COOKIE_NAME = 'df-session';

export interface SessionUser {
  id: string;
  username: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ userId: user.id, username: user.username, name: user.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
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

export async function destroySession() {
  cookies().set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
}

export async function signup(
  username: string,
  password: string,
  name?: string
): Promise<{ success: boolean; error?: string; user?: SessionUser }> {
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
  await createSession(sessionUser);
  return { success: true, user: sessionUser };
}

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: SessionUser }> {
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
  await createSession(sessionUser);
  return { success: true, user: sessionUser };
}
