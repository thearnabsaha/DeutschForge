'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Sign up failed');
        return;
      }
      router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-primary)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[400px]"
      >
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]">
            <Flame size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">DeutschForge</h1>
            <p className="text-xs text-[var(--text-tertiary)]">Cognitive Mastery</p>
          </div>
        </div>

        <GlassCard hover={false} className="p-8">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Create your account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Choose a username (min 3 characters)"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                Name <span className="text-[var(--text-tertiary)]">(optional)</span>
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Your display name"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Min 6 characters"
                disabled={loading}
              />
            </div>
            {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--text-tertiary)]">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[var(--accent)] hover:underline">
              Log in
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
