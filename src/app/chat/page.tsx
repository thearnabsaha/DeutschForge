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
  Trash2,
  X,
  AlertTriangle,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  const handleDeleteSession = async (sessionId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeletingId(sessionId);
    try {
      const res = await fetch(`/api/chat/sessions?sessionId=${sessionId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
      toast.success('Chat deleted');
    } catch {
      toast.error('Failed to delete chat');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAllSessions = async () => {
    setClearingAll(true);
    try {
      const res = await fetch('/api/chat/sessions?all=true', {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to clear');
      setSessions([]);
      setActiveSessionId(null);
      setMessages([]);
      setShowClearAllModal(false);
      toast.success('All chat history deleted');
    } catch {
      toast.error('Failed to clear chat history');
    } finally {
      setClearingAll(false);
    }
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
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setInput(text);
      toast.error('Failed to send message');
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
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 transform border-r border-[var(--border)] bg-[var(--bg-secondary)] transition-transform md:static md:translate-x-0 flex flex-col justify-between',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col min-h-0">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} className="text-[var(--accent)]" />
              <span className="font-bold text-base text-[var(--text-primary)]">Chat History</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden rounded-lg p-2 hover:bg-[var(--bg-tertiary)]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-3">
            <button
              onClick={handleNewChat}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border)] px-4 py-2.5 text-sm font-bold text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5"
            >
              <Plus size={18} />
              <span>New Conversation</span>
            </button>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1.5 min-h-0">
            {sessions.length === 0 ? (
              <div className="py-12 text-center text-xs text-[var(--text-tertiary)]">
                No past conversations yet
              </div>
            ) : (
              sessions.map((s) => {
                const isActive = activeSessionId === s.id;
                const isDeleting = deletingId === s.id;

                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSession(s.id)}
                    className={cn(
                      'group relative flex items-center justify-between rounded-xl px-3 py-2.5 transition-all cursor-pointer border border-transparent',
                      isActive
                        ? 'bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)] font-semibold shadow-sm'
                        : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                    )}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="truncate text-xs sm:text-sm font-bold">
                        {s.messageCount} msgs · <span className="text-[var(--accent)]">{s.cefrLevel}</span>
                      </div>
                      <div className="mt-0.5 text-[11px] text-[var(--text-tertiary)]">
                        {formatDate(s.createdAt)}
                      </div>
                    </div>

                    <button
                      type="button"
                      title="Delete chat"
                      disabled={isDeleting}
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      className="rounded-lg p-1.5 text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 hover:bg-rose-500/15 hover:text-rose-500 transition-all max-sm:opacity-100 shrink-0"
                    >
                      {isDeleting ? (
                        <Loader2 size={14} className="animate-spin text-rose-500" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Sidebar Footer with Clear All */}
          {sessions.length > 0 && (
            <div className="border-t border-[var(--border)] p-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowClearAllModal(true)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 size={14} />
                <span>Clear All Chat History</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main chat area */}
      <main className="flex flex-1 flex-col min-w-0 bg-[var(--bg-primary)]">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 bg-[var(--bg-secondary)]/50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 rounded-xl p-2 hover:bg-[var(--bg-tertiary)] md:hidden text-[var(--text-primary)]"
            >
              <MessageCircle size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <Bot size={20} className="text-[var(--accent)]" />
              <span className="font-bold text-sm text-[var(--text-primary)]">
                {activeSessionId ? 'Active Conversation' : 'New German Chat'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Globe size={15} className="text-[var(--text-tertiary)]" />
              <select
                value={cefrLevel}
                onChange={(e) => setCefrLevel(e.target.value)}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-xs font-bold text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              >
                {CEFR_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    Level {l}
                  </option>
                ))}
              </select>
            </div>

            {activeSessionId && (
              <button
                type="button"
                title="Delete this chat"
                onClick={() => handleDeleteSession(activeSessionId)}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors border border-rose-500/20"
              >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Delete Chat</span>
              </button>
            )}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 sm:py-24 text-center max-w-md mx-auto"
            >
              <div className="rounded-3xl bg-[var(--accent)]/15 p-6 shadow-sm border border-[var(--accent)]/30">
                <Bot size={48} className="text-[var(--accent)]" />
              </div>
              <h2 className="mt-6 text-2xl font-black tracking-tight text-[var(--text-primary)]">
                German AI Conversation
              </h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                Practice typing and conversing in German naturally. I adapt to your chosen CEFR level and provide instant grammar and vocabulary feedback.
              </p>
              <button
                onClick={() => inputRef.current?.focus()}
                className="btn-duo-primary mt-6 py-2.5 px-6 text-sm font-black rounded-xl inline-flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Start Typing Below</span>
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
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
                        <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed">{msg.content}</p>
                      </div>
                    ) : (
                      <div className="max-w-[85%]">
                        <GlassCard hover={false} className="rounded-2xl rounded-bl-md p-5">
                          <div className="flex items-start gap-3">
                            <div className="rounded-full bg-[var(--accent)]/20 p-1.5 shrink-0">
                              <Bot size={16} className="text-[var(--accent)]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)]">
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
                                      className="flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs"
                                    >
                                      <AlertCircle size={14} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                                      <div>
                                        <span className="text-red-500 line-through font-bold">{c.original}</span>
                                        {' → '}
                                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{c.corrected}</span>
                                        <p className="mt-1 text-[var(--text-secondary)]">{c.rule}</p>
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
                  <div className="rounded-2xl rounded-bl-md bg-[var(--bg-tertiary)] px-5 py-3 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-[var(--accent)]" />
                    <span className="text-xs text-[var(--text-secondary)] font-medium">Antwort wird verfasst...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-[var(--border)] p-4 bg-[var(--bg-secondary)]/30 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-3 max-w-3xl mx-auto"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Schreibe auf Deutsch..."
              disabled={loading}
              className="input-field flex-1 text-sm font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="btn-duo-primary py-2 px-5 text-sm font-black rounded-xl flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              <span>Send</span>
            </button>
          </form>
        </div>
      </main>

      {/* Confirmation Modal for Clear All */}
      <AnimatePresence>
        {showClearAllModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl border-2 border-[var(--border)] bg-[var(--bg-primary)] p-6 shadow-2xl"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-black text-[var(--text-primary)]">Clear All Chat History?</h3>
              <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                This will permanently delete all your conversation sessions and messages. This action cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowClearAllModal(false)}
                  disabled={clearingAll}
                  className="btn-duo-secondary py-2.5 px-4 text-xs font-black flex-1 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClearAllSessions}
                  disabled={clearingAll}
                  className="btn-duo-danger py-2.5 px-4 text-xs font-black flex-1 rounded-xl flex items-center justify-center gap-2"
                >
                  {clearingAll ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                  <span>{clearingAll ? 'Clearing...' : 'Delete All'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
