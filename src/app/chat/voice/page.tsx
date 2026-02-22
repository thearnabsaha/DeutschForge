'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2, User, Bot, Globe, AlertCircle, LogOut } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognition = typeof window !== 'undefined' ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;

function speak(text: string) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = 0.85;
  speechSynthesis.speak(utterance);
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  translation?: string;
  corrections?: Array<{ original: string; corrected: string; rule: string }>;
}

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;

export default function VoiceChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [cefrLevel, setCefrLevel] = useState<string>('A1');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const recognitionRef = useRef<InstanceType<NonNullable<typeof SpeechRecognition>> | null>(null);
  const conversationRef = useRef<HTMLDivElement>(null);

  const supportsSpeech = !!SpeechRecognition;

  useEffect(() => {
    conversationRef.current?.scrollTo({
      top: conversationRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const startRecording = () => {
    if (!supportsSpeech || isProcessing) return;
    try {
      const Recognition = SpeechRecognition;
      if (!Recognition) return;
      const recognition = new Recognition();
      recognition.lang = 'de-DE';
      recognition.continuous = false;
      recognition.interimResults = true;

      let finalTranscript = '';

      recognition.onstart = () => {
        setIsRecording(true);
        setStatusText('Listening...');
      };

      recognition.onresult = (event: { results: ArrayLike<{ isFinal: boolean; length: number; [i: number]: { transcript: string } }> }) => {
        const results = event.results;
        const lastResult = results[results.length - 1];
        if (lastResult?.isFinal && lastResult.length > 0) {
          const item = lastResult[lastResult.length - 1];
          if (item?.transcript) {
            finalTranscript = item.transcript.trim();
          }
        }
      };

      recognition.onend = async () => {
        setIsRecording(false);
        if (finalTranscript) {
          setStatusText('Processing...');
          setIsProcessing(true);
          const userMsg: Message = {
            id: `u-${Date.now()}`,
            role: 'user',
            content: finalTranscript,
          };
          setMessages((prev) => [...prev, userMsg]);

          try {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionId,
                message: finalTranscript,
                cefrLevel,
              }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed');

            if (!sessionId) setSessionId(data.sessionId);

            const aiMsg: Message = {
              id: `a-${Date.now()}`,
              role: 'assistant',
              content: data.reply,
              translation: data.translation,
              corrections: data.corrections || [],
            };
            setMessages((prev) => [...prev, aiMsg]);
            speak(data.reply);
          } catch {
            setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
            setStatusText('Error. Try again.');
          } finally {
            setIsProcessing(false);
            setStatusText('');
          }
        } else {
          setStatusText('');
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setStatusText('');
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch {
      setStatusText('Speech recognition failed');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleEndSession = () => {
    router.push('/chat');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] max-w-2xl mx-auto">
      {/* Top: CEFR selector + End Session */}
      <header className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-[var(--text-tertiary)]" />
          <select
            value={cefrLevel}
            onChange={(e) => setCefrLevel(e.target.value)}
            disabled={isRecording || isProcessing}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-2 text-sm font-medium outline-none focus:border-[var(--accent)]"
          >
            {CEFR_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleEndSession}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
        >
          <LogOut size={18} />
          End Session
        </button>
      </header>

      {/* Browser support warning */}
      {!supportsSpeech && (
        <div className="mx-4 mt-4 flex items-start gap-3 rounded-xl border border-amber-500/50 bg-amber-500/10 p-4">
          <AlertCircle size={20} className="shrink-0 text-amber-600" />
          <div>
            <p className="font-medium text-amber-700 dark:text-amber-400">
              Speech recognition not supported
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Use Chrome, Edge, or Safari for voice input.
            </p>
          </div>
        </div>
      )}

      {/* Middle: Scrollable conversation */}
      <div
        ref={conversationRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        {messages.length === 0 && supportsSpeech && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="rounded-full bg-[var(--accent)]/10 p-6">
              <Mic size={40} className="text-[var(--accent)]" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">Voice Conversation</h2>
            <p className="mt-2 max-w-sm text-sm text-[var(--text-secondary)]">
              Tap the microphone and speak in German. I'll respond at your level and correct any mistakes.
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'user' ? (
                <div className="flex max-w-[85%] items-start gap-2">
                  <div className="rounded-2xl rounded-br-md bg-[var(--accent)] px-4 py-3 text-white">
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  </div>
                  <User size={18} className="mt-2 shrink-0 text-[var(--text-tertiary)]" />
                </div>
              ) : (
                <div className="flex max-w-[85%] items-start gap-2">
                  <Bot size={18} className="mt-2 shrink-0 text-[var(--accent)]" />
                  <div className="rounded-2xl rounded-bl-md bg-[var(--bg-tertiary)] px-4 py-3">
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    {msg.translation && (
                      <TranslationToggle translation={msg.translation} />
                    )}
                    {msg.corrections && msg.corrections.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-[var(--border)] pt-3">
                        {msg.corrections.map((c, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-amber-500/5 px-3 py-2 text-xs"
                          >
                            <span className="text-red-600 line-through">{c.original}</span>
                            {' → '}
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                              {c.corrected}
                            </span>
                            <p className="mt-1 text-[var(--text-tertiary)]">{c.rule}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-[var(--bg-tertiary)] px-4 py-3">
              <Loader2 size={18} className="animate-spin text-[var(--accent)]" />
              <span className="text-sm text-[var(--text-tertiary)]">Thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom: Large centered mic button */}
      <div className="shrink-0 border-t border-[var(--border)] px-4 py-8">
        <div className="flex flex-col items-center gap-3">
          <motion.button
            onClick={toggleRecording}
            disabled={!supportsSpeech || isProcessing}
            className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-colors ${
              isRecording
                ? 'bg-red-500'
                : isProcessing
                  ? 'bg-[var(--bg-tertiary)] cursor-not-allowed'
                  : 'bg-[var(--accent)] hover:opacity-90'
            }`}
            whileHover={!isRecording && !isProcessing ? { scale: 1.05 } : undefined}
            whileTap={!isRecording && !isProcessing ? { scale: 0.95 } : undefined}
          >
            {isProcessing ? (
              <Loader2 size={32} className="animate-spin text-white" />
            ) : (
              <Mic size={32} className="text-white" />
            )}
            {isRecording && (
              <motion.span
                className="absolute inset-0 rounded-full border-4 border-red-500"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
            )}
          </motion.button>
          <p className="text-sm text-[var(--text-tertiary)] min-h-[1.25rem]">
            {statusText || (isProcessing ? 'Processing...' : 'Tap to speak')}
          </p>
        </div>
      </div>
    </div>
  );
}

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
        <p className="mt-2 rounded-lg bg-[var(--bg-secondary)] p-3 text-sm italic text-[var(--text-secondary)]">
          {translation}
        </p>
      )}
    </div>
  );
}
