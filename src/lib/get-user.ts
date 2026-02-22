import { getSession } from './auth';

export async function getCurrentUserId(): Promise<string> {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');
  return session.id;
}
