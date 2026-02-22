'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, ArrowRight, Loader2, User, Bot } from 'lucide-react';
import { ExamTimer } from '@/components/exam/exam-timer';
import { useTimer } from '@/hooks/use-timer';
import { cn } from '@/lib/utils';

interface Message {
  role: 'examiner' | 'candidate';
  content: string;
}

interface SprechenTask {
  id: string;
  type: string;
  topic: string;
  instructions: string;
  talkingPoints?: string[];
}

interface SprechenSection {
  instructions: string;
  timeMinutes: number;
  task?: string;
  starterPrompt?: string;
  tasks?: SprechenTask[];
}

export default function SprechenPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attemptId as string;

  const [section, setSection] = useState<SprechenSection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleFinish = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await fetch(`/api/exam/${attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'SPRECHEN', answers: { messages } }),
      });
      router.push(`/exam/${attemptId}/report`);
    } catch {
      setSubmitting(false);
    }
  }, [attemptId, messages, router, submitting]);

  const totalSeconds = (section?.timeMinutes ?? 15) * 60;
  const { remaining, progress } = useTimer({
    key: `exam-${attemptId}-SPRECHEN`,
    totalSeconds,
    onExpire: handleFinish,
    autoStart: !!section,
  });

  useEffect(() => {
    fetch(`/api/exam/${attemptId}/section?section=SPRECHEN`)
      .then((r) => r.json())
      .then((data) => {
        if (data.tasks && !data.task) {
          const firstTask = data.tasks[0];
          if (firstTask) {
            data.task = firstTask.topic;
            const points = firstTask.talkingPoints?.map((p: string) => `- ${p}`).join('\n') || '';
            data.starterPrompt = `${firstTask.instructions}\n\n${points}`;
          }
        }
        setSection(data);
        if (data?.starterPrompt) {
          setMessages([{ role: 'examiner', content: data.starterPrompt }]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [attemptId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending || !section) return;
    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'candidate', content: userMsg }];
    setMessages(newMessages);
    setSending(true);

    try {
      const res = await fetch('/api/ai/speaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cefrLevel: 'A1',
          task: section.task,
          history: newMessages,
          userMessage: userMsg,
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'examiner', content: data.response }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: 'examiner', content: 'Entschuldigung, können Sie das wiederholen?' },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!section) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--text-secondary)]">Section not found.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-4xl px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/20">
              <MessageCircle size={20} className="text-orange-500" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Sprechen – Speaking Prep</h1>
              <p className="text-xs text-[var(--text-tertiary)]">
                AI examiner conversation
              </p>
            </div>
          </div>
          <ExamTimer remainingSeconds={remaining} progressPercent={progress * 100} />
        </div>

        <div className="mt-4 rounded-xl bg-[var(--bg-tertiary)] p-4">
          <p className="text-xs font-medium text-[var(--text-tertiary)]">Task:</p>
          <p className="mt-1 text-sm text-[var(--text-primary)]">{section.task}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6">
        <div className="mx-auto max-w-4xl space-y-4 pb-32">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn('flex gap-3', msg.role === 'candidate' && 'flex-row-reverse')}
              >
                <div className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  msg.role === 'examiner'
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-[var(--bg-tertiary)]'
                )}>
                  {msg.role === 'examiner' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={cn(
                  'max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  msg.role === 'examiner'
                    ? 'card-surface'
                    : 'bg-[var(--accent)] text-white'
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {sending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                <Bot size={16} />
              </div>
              <div className="card-surface flex items-center gap-1.5 rounded-2xl px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-[var(--text-tertiary)]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--bg-primary)] p-4">
        <div className="mx-auto flex max-w-4xl gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Schreiben Sie Ihre Antwort auf Deutsch..."
            className="input-field flex-1"
            disabled={sending}
          />
          <motion.button
            onClick={sendMessage}
            disabled={!input.trim() || sending}
            className="btn-primary px-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={16} />
          </motion.button>
          <motion.button
            onClick={handleFinish}
            disabled={submitting}
            className="btn-secondary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            Finish Exam
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
