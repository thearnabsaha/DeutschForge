'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen,
  Headphones,
  PenTool,
  MessageCircle,
  Trophy,
  ArrowLeft,
  Brain,
  Loader2,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Badge } from '@/components/ui/badge';
import { scoreToGrade, scoreToColor } from '@/lib/utils';

interface SectionResult {
  section: string;
  score: number | null;
  maxScore: number;
  feedback: Record<string, unknown> | null;
}

interface ExamReport {
  cefrLevel: string;
  totalScore: number;
  maxScore: number;
  completedAt: string;
  sections: SectionResult[];
}

const sectionIcons: Record<string, typeof BookOpen> = {
  LESEN: BookOpen,
  HOEREN: Headphones,
  SCHREIBEN: PenTool,
  SPRECHEN: MessageCircle,
};

const sectionLabels: Record<string, string> = {
  LESEN: 'Lesen (Reading)',
  HOEREN: 'Hören (Listening)',
  SCHREIBEN: 'Schreiben (Writing)',
  SPRECHEN: 'Sprechen (Speaking)',
};

const sectionColors: Record<string, string> = {
  LESEN: 'text-blue-500',
  HOEREN: 'text-purple-500',
  SCHREIBEN: 'text-emerald-500',
  SPRECHEN: 'text-orange-500',
};

export default function ReportPage() {
  const params = useParams();
  const attemptId = params.attemptId as string;
  const [report, setReport] = useState<ExamReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/exam/${attemptId}/report`)
      .then((r) => r.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--text-secondary)]">Report not found.</p>
      </div>
    );
  }

  const percentage = Math.round((report.totalScore / report.maxScore) * 100);
  const passed = percentage >= 60;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link href="/exam" className="rounded-xl p-2 hover:bg-black/5 dark:hover:bg-white/5">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Exam Report</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Goethe-Zertifikat {report.cefrLevel}
          </p>
        </div>
      </motion.div>

      <motion.div
        className="mt-8 grid gap-6 lg:grid-cols-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard hover={false} className="flex flex-col items-center justify-center lg:col-span-1">
          <ProgressRing
            progress={percentage}
            size={140}
            strokeWidth={10}
            color={passed ? 'var(--success)' : 'var(--danger)'}
            label={`${report.totalScore}`}
            sublabel={`/ ${report.maxScore}`}
          />
          <div className="mt-4 text-center">
            <Badge variant="level" level={report.cefrLevel}>{report.cefrLevel}</Badge>
            <motion.p
              className={`mt-2 text-lg font-semibold ${passed ? 'text-emerald-500' : 'text-red-500'}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
            >
              {passed ? 'Bestanden!' : 'Nicht bestanden'}
            </motion.p>
            <p className="text-xs text-[var(--text-tertiary)]">
              {scoreToGrade(report.totalScore, report.maxScore)} ({percentage}%)
            </p>
          </div>
        </GlassCard>

        <div className="space-y-4 lg:col-span-2">
          {report.sections.map((sec, i) => {
            const Icon = sectionIcons[sec.section] || BookOpen;
            const label = sectionLabels[sec.section] || sec.section;
            const color = sectionColors[sec.section] || 'text-[var(--accent)]';
            const score = sec.score ?? 0;
            const pct = Math.round((score / sec.maxScore) * 100);

            return (
              <motion.div
                key={sec.section}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1 }}
              >
                <GlassCard hover={false} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon size={20} className={color} />
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-[11px] text-[var(--text-tertiary)]">
                          {score}/{sec.maxScore} points
                        </p>
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${scoreToColor(score, sec.maxScore)}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--accent)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                    />
                  </div>

                  {sec.feedback && Object.keys(sec.feedback).length > 0 && (
                    <div className="mt-3 rounded-xl bg-[var(--bg-tertiary)] p-3">
                      <p className="text-xs font-medium text-[var(--text-tertiary)]">Feedback</p>
                      {sec.feedback.overallFeedback != null && (
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          {String(sec.feedback.overallFeedback)}
                        </p>
                      )}
                      {sec.feedback.corrections && Array.isArray(sec.feedback.corrections) ? (
                        <div className="mt-2 space-y-1">
                          {(sec.feedback.corrections as Array<{original: string; corrected: string; explanation: string}>).slice(0, 3).map((c, ci) => (
                            <div key={ci} className="text-xs">
                              <span className="text-red-500 line-through">{String(c.original)}</span>
                              {' → '}
                              <span className="font-medium text-emerald-500">{String(c.corrected)}</span>
                              <span className="text-[var(--text-tertiary)]"> – {String(c.explanation)}</span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        className="mt-8 flex justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link href={`/exam/${attemptId}/review`}>
          <motion.button className="btn-secondary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <BookOpen size={16} />
            Review Answers
          </motion.button>
        </Link>
        <Link href="/exam">
          <motion.button className="btn-secondary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Trophy size={16} />
            New Exam
          </motion.button>
        </Link>
        <Link href="/practice">
          <motion.button className="btn-primary" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Brain size={16} />
            Practice Weak Areas
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
