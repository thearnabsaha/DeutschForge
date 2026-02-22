'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthUser {
  id: string;
  username: string;
  name: string;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({ user: null, loading: true, refresh: async () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

const PUBLIC_PATHS = ['/', '/login', '/signup'];

function isPublic(path: string) {
  return PUBLIC_PATHS.includes(path);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data?.id ? data : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!checked) return;

    if (!user && !isPublic(pathname)) {
      router.replace('/login');
    }

    if (user && (pathname === '/login' || pathname === '/signup')) {
      router.replace('/dashboard');
    }
  }, [user, pathname, checked, router]);

  if (!checked) {
    if (isPublic(pathname)) return <>{children}</>;

    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (!user && !isPublic(pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
