'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Plus,
  MessageCircle,
  Globe,
  AlertCircle,
  Bot,
  User,
  Loader2,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

interface Session {
  id: string;
  cefrLevel: string;
  messageCount: number;
  createdAt: string;
}

interface Message {
  id: string;
  role: string;
  content: string;
  translation?: string | null;
  corrections?: Array<{ original: string; corrected: string; rule: string }> | null;
  createdAt: string;
}

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;

function TranslationToggle({ translation }: { translation: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="mt-3">
      <button
        onClick={() => setShow(!show)}
        className="text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--accent)]"
      >
        {show ? 'Hide' : 'Show'} English translation
      </button>
      {show && (
        <p className="mt-2 rounded-lg bg-[var(--bg-tertiary)] p-3 text-sm italic text-[var(--text-secondary)]">
          {translation}
        </p>
      )}
    </div>
  );
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [cefrLevel, setCefrLevel] = useState<string>('A1');
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/sessions');
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch {
      setSessions([]);
    }
  }, []);

  const fetchMessages = useCallback(async (sessionId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/chat/messages?sessionId=${sessionId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (activeSessionId) {
      fetchMessages(activeSessionId);
    } else {
      setMessages([]);
    }
  }, [activeSessionId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setInput('');
    setSidebarOpen(false);
    inputRef.current?.focus();
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setSidebarOpen(false);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSessionId,
          message: text,
          cefrLevel,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send');

      if (!activeSessionId) {
        setActiveSessionId(data.sessionId);
        setSessions((prev) => [{ id: data.sessionId, cefrLevel, messageCount: 2, createdAt: new Date().toISOString() }, ...prev]);
      } else {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === data.sessionId ? { ...s, messageCount: s.messageCount + 2 } : s
          )
        );
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        translation: data.translation,
        corrections: data.corrections || [],
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev.slice(0, -1), userMsg, aiMsg]);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setInput(text);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    return isToday ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString();
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-[var(--border)] bg-[var(--bg-secondary)] transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} className="text-[var(--accent)]" />
              <span className="font-semibold">Chat</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden rounded-lg p-2 hover:bg-[var(--bg-tertiary)]"
            >
              ×
            </button>
          </div>
          <button
            onClick={handleNewChat}
            className="mx-4 mt-4 flex items-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <Plus size={18} />
            New Chat
          </button>
          <div className="mt-4 flex-1 overflow-y-auto px-2">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSession(s.id)}
                className={`mb-1 w-full rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                  activeSessionId === s.id
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <div className="truncate font-medium">
                  {s.messageCount} messages · {s.cefrLevel}
                </div>
                <div className="mt-0.5 text-xs text-[var(--text-tertiary)]">
                  {formatDate(s.createdAt)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main chat area */}
      <main className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 rounded-xl p-2 hover:bg-[var(--bg-tertiary)] md:hidden"
          >
            <MessageCircle size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Globe size={16} className="text-[var(--text-tertiary)]" />
            <select
              value={cefrLevel}
              onChange={(e) => setCefrLevel(e.target.value)}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-1.5 text-sm outline-none focus:border-[var(--accent)]"
            >
              {CEFR_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {loadingMessages ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={28} className="animate-spin text-[var(--accent)]" />
            </div>
          ) : !activeSessionId && messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="rounded-2xl bg-[var(--accent)]/10 p-6">
                <Bot size={48} className="text-[var(--accent)]" />
              </div>
              <h2 className="mt-6 text-xl font-semibold">German Chat Partner</h2>
              <p className="mt-2 max-w-sm text-sm text-[var(--text-secondary)]">
                Start a conversation in German. I'll respond at your CEFR level and gently correct any mistakes.
              </p>
              <button
                onClick={handleNewChat}
                className="btn-primary mt-6"
              >
                <Plus size={18} />
                New Chat
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'user' ? (
                      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-[var(--accent)] px-5 py-3 text-white shadow-sm">
                        <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                      </div>
                    ) : (
                      <div className="max-w-[85%]">
                        <GlassCard hover={false} className="rounded-2xl rounded-bl-md p-5">
                          <div className="flex items-start gap-3">
                            <div className="rounded-full bg-[var(--accent)]/20 p-1.5">
                              <Bot size={16} className="text-[var(--accent)]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                {msg.content}
                              </p>
                              {msg.translation && (
                                <TranslationToggle translation={msg.translation} />
                              )}
                              {msg.corrections && msg.corrections.length > 0 && (
                                <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-3">
                                  {msg.corrections.map((c, i) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-2 rounded-lg bg-amber-500/5 px-3 py-2 text-xs"
                                    >
                                      <AlertCircle size={14} className="mt-0.5 shrink-0 text-amber-600" />
                                      <div>
                                        <span className="text-red-600 line-through">{c.original}</span>
                                        {' → '}
                                        <span className="text-emerald-600 font-medium">{c.corrected}</span>
                                        <p className="mt-1 text-[var(--text-tertiary)]">{c.rule}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </GlassCard>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="rounded-2xl rounded-bl-md bg-[var(--bg-tertiary)] px-5 py-3">
                    <Loader2 size={18} className="animate-spin text-[var(--text-tertiary)]" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-[var(--border)] p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write in German..."
              disabled={loading}
              className="input-field flex-1"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="btn-primary flex items-center gap-2 px-5"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
