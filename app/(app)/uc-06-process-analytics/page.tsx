"use client";
import { useEffect, useRef, useState } from "react";
import PageHeader from "../../../components/shell/page-header";
import { Send, Sparkles, MessageSquarePlus, Trash2, BarChart3, Info, ChevronRight } from "lucide-react";

interface Message {
  id: string; role: string; content: string; data: any; createdAt: string;
}
interface Session {
  id: string; title: string; updatedAt: string; _count?: { messages: number };
}

const SUGGESTED_PROMPTS = [
  "What is our average onboarding TAT this month across all branches?",
  "Which branch is performing best and worst on TAT? Any patterns?",
  "How many SOP deviations were flagged as CRITICAL vs MAJOR?",
  "What's the AI usage look like — how many Claude calls have we made?",
  "Where in the process is the biggest bottleneck right now?",
];

export default function UC06Page() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function loadSessions() {
    const r = await fetch("/api/uc06/sessions", { cache: "no-store" });
    const j = await r.json();
    if (j.success) setSessions(j.data);
  }

  async function loadSession(id: string) {
    setActiveId(id);
    const r = await fetch(`/api/uc06/sessions/${id}`, { cache: "no-store" });
    const j = await r.json();
    if (j.success) setMessages(j.data.messages);
  }

  async function newSession() {
    const r = await fetch("/api/uc06/sessions", { method: "POST" });
    const j = await r.json();
    if (j.success) {
      await loadSessions();
      setActiveId(j.data.id);
      setMessages([]);
    }
  }

  async function deleteSession(id: string) {
    if (!confirm("Delete this chat?")) return;
    await fetch(`/api/uc06/sessions/${id}`, { method: "DELETE" });
    if (activeId === id) { setActiveId(null); setMessages([]); }
    await loadSessions();
  }

  async function send(text?: string) {
    const question = (text ?? input).trim();
    if (!question || sending) return;
    setError(null);

    let sessionId = activeId;
    if (!sessionId) {
      const r = await fetch("/api/uc06/sessions", { method: "POST" });
      const j = await r.json();
      if (!j.success) { setError("Could not start a session"); return; }
      sessionId = j.data.id;
      setActiveId(sessionId);
    }

    // Optimistic user message
    setMessages((m) => [...m, { id: "tmp-" + Date.now(), role: "user", content: question, data: null, createdAt: new Date().toISOString() }]);
    setInput("");
    setSending(true);
    try {
      const r = await fetch("/api/uc06/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, question }),
      });
      const j = await r.json();
      if (!j.success) throw new Error(j.error?.message ?? "Chat failed");
      await loadSession(sessionId!);
      await loadSessions();
    } catch (e: any) { setError(e.message); }
    finally { setSending(false); }
  }

  useEffect(() => { loadSessions(); }, []);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  return (
    <>
      <PageHeader
        code="UC 06"
        title="Process Analytics & TAT"
        description="Conversational analytics for managers and leadership. Ask questions in plain English about process velocity, deviations, onboarding TAT, branch performance, and Claude weaves data + narrative into an answer."
        actions={<button onClick={newSession} className="btn-primary"><MessageSquarePlus className="w-4 h-4" strokeWidth={1.75}/> New chat</button>}
      />

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5" style={{ minHeight: "calc(100vh - 20rem)" }}>
        {/* Sessions sidebar */}
        <div className="xl:col-span-1">
          <div className="glass">
            <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.6)' }}>
              <div className="label">Chats</div>
              <div className="text-[12px] font-mono text-ink-500">{sessions.length}</div>
            </div>
            {sessions.length === 0 ? (
              <div className="p-6 text-center text-[12px] text-ink-500">No chats yet</div>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'rgba(148,163,184,0.15)' }}>
                {sessions.map((s) => (
                  <li key={s.id} className={`group flex items-center gap-2 pr-2 hover:bg-white/40 ${activeId === s.id ? "bg-white/50" : ""}`}>
                    <button onClick={() => loadSession(s.id)} className="flex-1 min-w-0 text-left px-3 py-2.5">
                      <div className="text-[12px] font-medium text-ink-900 truncate tracking-tight">{s.title}</div>
                      <div className="text-[10px] font-mono text-ink-500 mt-0.5">{s._count?.messages ?? 0} msgs</div>
                    </button>
                    <button onClick={() => deleteSession(s.id)} className="opacity-0 group-hover:opacity-100 p-1 text-ink-500 hover:text-red-600 transition">
                      <Trash2 className="w-3 h-3" strokeWidth={1.75}/>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="xl:col-span-4">
          <div className="glass flex flex-col" style={{ minHeight: "calc(100vh - 20rem)" }}>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4" style={{ minHeight: 400 }}>
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                       style={{ backgroundImage: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: '0 1px 0 0 rgba(255,255,255,0.4) inset, 0 12px 24px -8px rgba(79,70,229,0.4)' }}>
                    <Sparkles className="w-5 h-5 text-white" strokeWidth={1.75}/>
                  </div>
                  <h3 className="display text-2xl text-ink-900 mb-2">Ask about process performance</h3>
                  <p className="text-[13px] text-ink-500 text-center max-w-md leading-relaxed mb-6">
                    Try one of these to get started
                  </p>
                  <div className="w-full max-w-2xl grid grid-cols-1 gap-2">
                    {SUGGESTED_PROMPTS.map((p, i) => (
                      <button key={i} onClick={() => send(p)}
                              className="text-left text-[13px] text-ink-700 px-4 py-3 rounded-xl transition-all hover:-translate-y-0.5 flex items-center gap-2"
                              style={{ background: 'rgba(79, 70, 229, 0.04)', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
                        <ChevronRight className="w-3.5 h-3.5 text-accent-from shrink-0" strokeWidth={1.75}/>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <MessageBubble key={m.id} message={m} />
                ))
              )}
              {sending && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                       style={{ backgroundImage: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                    <Sparkles className="w-4 h-4 text-white" strokeWidth={1.75}/>
                  </div>
                  <div className="glass-sm px-4 py-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-from animate-pulse"/>
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-from animate-pulse" style={{ animationDelay: '0.2s' }}/>
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-from animate-pulse" style={{ animationDelay: '0.4s' }}/>
                    <span className="text-[12px] text-ink-500 ml-1">Analyzing metrics…</span>
                  </div>
                </div>
              )}
            </div>
            {error && (
              <div className="mx-6 mb-3 flex gap-2 text-[12px] px-3 py-2 rounded-xl"
                   style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#B91C1C' }}>
                <Info className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75}/> {error}
              </div>
            )}
            <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.5)' }}>
              <div className="glass-sm flex items-center gap-2 pl-4 pr-1 py-1">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Ask about TAT, deviations, branches, AI usage…"
                  disabled={sending}
                  className="flex-1 bg-transparent border-0 focus:outline-none text-[13px] py-2"
                />
                <button onClick={() => send()} disabled={!input.trim() || sending}
                        className="btn-primary py-2 px-3">
                  <Send className="w-3.5 h-3.5" strokeWidth={1.75}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-2xl px-4 py-2.5 rounded-2xl rounded-tr-md"
             style={{ backgroundImage: 'linear-gradient(135deg, #4F46E5, #7C3AED)', boxShadow: '0 4px 12px -4px rgba(79,70,229,0.4)' }}>
          <div className="text-[13px] text-white leading-relaxed">{message.content}</div>
        </div>
      </div>
    );
  }
  const data: any = message.data ?? {};
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
           style={{ backgroundImage: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
        <Sparkles className="w-4 h-4 text-white" strokeWidth={1.75}/>
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        <div className="glass-sm px-4 py-3">
          <div className="text-[13px] text-ink-900 leading-relaxed">{message.content}</div>
        </div>
        {Array.isArray(data.keyPoints) && data.keyPoints.length > 0 && (
          <div className="glass-sm px-4 py-3">
            <div className="label mb-2">Key points</div>
            <ul className="space-y-1.5">
              {data.keyPoints.map((k: string, i: number) => (
                <li key={i} className="text-[12px] text-ink-700 flex items-start gap-2">
                  <span className="text-accent-from mt-0.5">→</span> {k}
                </li>
              ))}
            </ul>
          </div>
        )}
        {Array.isArray(data.chartData) && data.chartData.length > 0 && (
          <div className="glass-sm px-4 py-3">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-3.5 h-3.5 text-accent-from" strokeWidth={1.75}/>
              <div className="label">Data</div>
            </div>
            <BarChart data={data.chartData}/>
          </div>
        )}
        {Array.isArray(data.suggestedFollowUps) && data.suggestedFollowUps.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.suggestedFollowUps.map((s: string, i: number) => (
              <span key={i} className="text-[11px] text-ink-500 px-2.5 py-1 rounded-md border"
                    style={{ borderColor: 'rgba(148,163,184,0.25)', background: 'rgba(255,255,255,0.4)' }}>
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BarChart({ data }: { data: Array<{ label: string; value: number }> }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-ink-700 font-medium">{d.label}</span>
            <span className="font-mono text-ink-500">{d.value}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.15)' }}>
            <div className="h-full rounded-full transition-all"
                 style={{ width: `${(d.value / max) * 100}%`, backgroundImage: 'linear-gradient(90deg, #4F46E5, #7C3AED)' }}/>
          </div>
        </div>
      ))}
    </div>
  );
}
