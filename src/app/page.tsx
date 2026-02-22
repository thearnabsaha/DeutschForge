'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Flame,
  Brain,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Mic,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe,
  Shield,
  Zap,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: Brain,
    title: 'Spaced Repetition',
    desc: 'FSRS-powered flashcards that adapt to your memory patterns for maximum retention.',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    icon: BookOpen,
    title: 'Smart Vocabulary',
    desc: 'Upload words in bulk. AI enriches them with gender, conjugation, examples, and CEFR level.',
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: GraduationCap,
    title: 'Goethe Exam Prep',
    desc: 'Full mock exams for A1–B2 with Lesen, Hören, Schreiben, Sprechen. Detailed review after.',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    icon: MessageCircle,
    title: 'AI Chat Partner',
    desc: 'Practice German conversation with AI. Get grammar corrections and translation in real time.',
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    icon: Mic,
    title: 'Voice Mode',
    desc: 'Speak German. AI listens, responds, and corrects your pronunciation and grammar.',
    color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    desc: 'Track hard words, weak areas, study streaks, and memory stability with AI insights.',
    color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  },
];

const levels = ['A1', 'A2', 'B1', 'B2'];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Navbar */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)]">
              <Flame size={18} className="text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">DeutschForge</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="btn-primary rounded-xl px-5 py-2.5 text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--accent)]/5 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-purple-500/5 blur-[100px]" />
        </div>

        <div className="mx-auto max-w-4xl px-5 text-center">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
              <Sparkles size={14} className="text-amber-500" />
              AI-powered German learning from A1 to B2
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
            >
              Master German with
              <br />
              <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
                Intelligence
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg"
            >
              Your personal German learning system. Spaced repetition, AI conversation,
              Goethe exam prep, and vocabulary analytics — all in one place.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="btn-primary flex items-center gap-2 rounded-2xl px-8 py-3.5 text-base font-semibold shadow-lg shadow-[var(--accent)]/20"
              >
                Start Learning Free
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-2xl px-8 py-3.5 text-base font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                Already have an account?
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mx-auto mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--text-tertiary)]">
              {['No credit card', 'Works offline', 'CEFR A1→B2'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CEFR Levels */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-secondary)]/50 py-12">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-3 px-5 sm:gap-6">
          <span className="text-sm font-medium text-[var(--text-tertiary)]">CEFR Levels</span>
          <div className="h-5 w-px bg-[var(--border)]" />
          {levels.map((level, i) => (
            <motion.div
              key={level}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white text-sm ${
                level === 'A1' ? 'bg-emerald-500' : level === 'A2' ? 'bg-blue-500' : level === 'B1' ? 'bg-amber-500' : 'bg-purple-500'
              }`}>
                {level}
              </div>
              {i < levels.length - 1 && (
                <ArrowRight size={14} className="text-[var(--text-tertiary)] hidden sm:block" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to learn German
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-3 max-w-xl text-[var(--text-secondary)]">
              Built with modern AI and proven learning science. No fluff.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 transition-all hover:border-[var(--accent)]/20 hover:shadow-lg"
              >
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-secondary)]/30 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-5">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start in 3 steps
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="mt-14 grid gap-8 sm:grid-cols-3"
          >
            {[
              { step: '01', title: 'Create account', desc: 'Sign up with a username and password. No email needed.', icon: Shield },
              { step: '02', title: 'Upload vocabulary', desc: 'Paste your German words. AI enriches them with gender, meaning, and examples.', icon: Globe },
              { step: '03', title: 'Practice daily', desc: 'Flashcards, grammar, exams, and AI chat adapt to your level.', icon: Zap },
            ].map((s) => (
              <motion.div key={s.step} variants={fadeUp} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent)]/10">
                  <s.icon size={24} className="text-[var(--accent)]" />
                </div>
                <span className="text-xs font-bold tracking-widest text-[var(--accent)]">STEP {s.step}</span>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--accent)]">
                <Flame size={32} className="text-white" />
              </div>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to forge your German?
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto mt-4 max-w-lg text-[var(--text-secondary)]">
              Join DeutschForge and start mastering German with AI-powered tools built for real results.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Link
                href="/signup"
                className="btn-primary inline-flex items-center gap-2 rounded-2xl px-10 py-4 text-base font-semibold shadow-lg shadow-[var(--accent)]/20"
              >
                Create Free Account
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)]">
              <Flame size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold">DeutschForge</span>
          </div>
          <p className="text-xs text-[var(--text-tertiary)]">
            Built for serious German learners. CEFR A1 to B2.
          </p>
        </div>
      </footer>
    </div>
  );
}
