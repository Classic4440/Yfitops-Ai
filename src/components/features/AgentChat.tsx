import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Send, Cpu, ChevronDown, Copy, Check } from 'lucide-react';
import { useAgentStore, AVAILABLE_MODELS } from '@/stores/agentStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useThemeStore } from '@/stores/themeStore';

// ── Copy button for code blocks ───────────────────────────────────────────────
const CopyButton: React.FC<{ code: string; accent: string; surface: string; border: string; radius: string }> = ({
  code, accent, surface, border, radius,
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy code"
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        background: surface,
        border: `1px solid ${border}`,
        color: copied ? accent : '#888',
        borderRadius: radius,
        padding: '2px 6px',
        fontSize: 10,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        transition: 'color 0.15s',
      }}
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

// ── Code block renderer ───────────────────────────────────────────────────────
const CodeBlock: React.FC<{
  lang: string;
  code: string;
  accent: string;
  surface: string;
  border: string;
  fontMono: string;
  radius: string;
}> = ({ lang, code, accent, surface, border, fontMono, radius }) => (
  <div style={{ position: 'relative', margin: '6px 0' }}>
    <pre
      style={{
        background: 'rgba(0,0,0,0.25)',
        borderRadius: radius,
        padding: '10px 12px',
        paddingTop: lang ? 28 : 10,
        paddingRight: 56,
        overflowX: 'auto',
        fontFamily: fontMono,
        fontSize: 11,
        lineHeight: 1.6,
        margin: 0,
        whiteSpace: 'pre',
      }}
    >
      {lang && (
        <div style={{ position: 'absolute', top: 6, left: 12, fontSize: 9, color: accent, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {lang}
        </div>
      )}
      <code>{code.trimEnd()}</code>
    </pre>
    <CopyButton code={code.trimEnd()} accent={accent} surface={surface} border={border} radius={radius} />
  </div>
);

// ── Inline content parser ─────────────────────────────────────────────────────
function formatContent(
  text: string,
  accent: string,
  surface: string,
  border: string,
  fontMono: string,
  radius: string,
) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const firstNewline = part.indexOf('\n');
      const lang = firstNewline > 3 ? part.slice(3, firstNewline).trim() : '';
      const code = (firstNewline >= 0 ? part.slice(firstNewline + 1) : part.slice(3)).replace(/```$/, '');
      return (
        <CodeBlock key={i} lang={lang} code={code} accent={accent} surface={surface} border={border} fontMono={fontMono} radius={radius} />
      );
    }
    return (
      <span key={i}>
        {part.split(/(`[^`\n]+`)/g).map((s, j) =>
          s.startsWith('`') && s.endsWith('`') ? (
            <code
              key={j}
              style={{
                background: 'rgba(0,0,0,0.25)',
                borderRadius: 3,
                padding: '1px 5px',
                fontFamily: fontMono,
                fontSize: '0.85em',
              }}
            >
              {s.slice(1, -1)}
            </code>
          ) : (
            <span key={j} style={{ whiteSpace: 'pre-wrap' }}>{s}</span>
          )
        )}
      </span>
    );
  });
}

// ── Streaming cursor ──────────────────────────────────────────────────────────
const StreamingCursor: React.FC<{ color: string }> = ({ color }) => (
  <span
    style={{
      display: 'inline-block',
      width: 2,
      height: '1em',
      background: color,
      marginLeft: 2,
      verticalAlign: 'text-bottom',
      animation: 'blink-cursor 0.8s step-end infinite',
    }}
  />
);

// ── Main component ────────────────────────────────────────────────────────────
export const AgentChat: React.FC = () => {
  const { messages, loading, streamingContent, selectedModel, sendMessage, setModel } = useAgentStore();
  const { currentWorkspace } = useWorkspaceStore();
  const { theme } = useThemeStore();
  const [input, setInput] = useState('');
  const [showModels, setShowModels] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, loading]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    sendMessage(text, currentWorkspace?.id);
  }, [input, loading, currentWorkspace, sendMessage]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const { bg, surface, border, accent, accentFg, text, textMuted, fontMono, fontSans, radius } = theme;

  return (
    <>
      <style>{`
        @keyframes blink-cursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse-dot { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
      `}</style>

      <div className="flex flex-col h-full" style={{ background: bg }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-2 border-b flex-shrink-0"
          style={{ borderColor: border, background: surface }}
        >
          <div className="flex items-center gap-2">
            <Cpu size={14} style={{ color: accent }} />
            <span className="text-xs font-semibold" style={{ color: text }}>Agent Chat</span>
            {currentWorkspace && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: accent + '22', color: accent }}>
                {currentWorkspace.repo_name}
              </span>
            )}
          </div>

          {/* Model selector */}
          <div className="relative">
            <button
              onClick={() => setShowModels((v) => !v)}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-opacity hover:opacity-80"
              style={{ background: bg, border: `1px solid ${border}`, color: textMuted, borderRadius: radius }}
            >
              {AVAILABLE_MODELS.find((m) => m.id === selectedModel)?.label ?? selectedModel}
              <ChevronDown size={10} />
            </button>
            {showModels && (
              <div
                className="absolute right-0 top-8 z-50 w-52 rounded shadow-xl"
                style={{ background: surface, border: `1px solid ${border}`, borderRadius: radius }}
              >
                {AVAILABLE_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setModel(m.id); setShowModels(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:opacity-80 transition-opacity"
                    style={{
                      color: m.id === selectedModel ? accent : text,
                      background: m.id === selectedModel ? accent + '15' : 'transparent',
                    }}
                  >
                    <div className="font-medium">{m.label}</div>
                    <div className="opacity-50 mt-0.5">{m.id}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3" style={{ color: textMuted }}>
              <Cpu size={32} style={{ color: accent, opacity: 0.4 }} />
              <div className="text-sm font-medium" style={{ color: text }}>Ask the agent anything</div>
              <div className="text-xs max-w-xs" style={{ color: textMuted }}>
                Write code · Fix bugs · Explain architecture · Generate git commits
              </div>
              <div className="text-xs mt-2 opacity-60">Shift+Enter for new line · Enter to send</div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animation: 'fadeIn 0.15s ease' }}>
              <div
                className="max-w-[88%] rounded-xl px-4 py-3 text-sm"
                style={{
                  background: msg.role === 'user' ? accent : surface,
                  color: msg.role === 'user' ? accentFg : text,
                  border: msg.role === 'user' ? 'none' : `1px solid ${border}`,
                  borderRadius: radius,
                  fontFamily: msg.role === 'assistant' ? fontMono : fontSans,
                  fontSize: '0.8rem',
                  lineHeight: 1.65,
                }}
              >
                {msg.role === 'assistant'
                  ? formatContent(msg.content, accent, surface, border, fontMono, radius)
                  : <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>}
                {msg.model_id && (
                  <div className="mt-2 text-xs" style={{ opacity: 0.35, fontFamily: fontSans }}>
                    {msg.model_id.split('/')[1]}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Live streaming bubble */}
          {loading && (
            <div className="flex justify-start">
              <div
                className="max-w-[88%] px-4 py-3 rounded-xl text-sm"
                style={{
                  background: surface,
                  border: `1px solid ${border}`,
                  borderRadius: radius,
                  fontFamily: fontMono,
                  fontSize: '0.8rem',
                  lineHeight: 1.65,
                  color: text,
                }}
              >
                {streamingContent ? (
                  <>
                    {formatContent(streamingContent, accent, surface, border, fontMono, radius)}
                    <StreamingCursor color={accent} />
                  </>
                ) : (
                  <span className="flex gap-1.5 items-center py-0.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: accent,
                          display: 'inline-block',
                          animation: `pulse-dot 1s ${i * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </span>
                )}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t flex-shrink-0" style={{ borderColor: border, background: surface }}>
          <div
            className="flex items-end gap-2 rounded-xl px-3 py-2"
            style={{ background: bg, border: `1px solid ${border}`, borderRadius: radius }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask the agent…"
              rows={1}
              className="flex-1 resize-none bg-transparent outline-none text-sm"
              style={{ color: text, fontFamily: fontSans, maxHeight: 140, minHeight: 24 }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="p-1.5 rounded-lg transition-opacity disabled:opacity-30 hover:opacity-80"
              style={{ background: accent, color: accentFg, borderRadius: radius, flexShrink: 0 }}
            >
              <Send size={14} />
            </button>
          </div>
          <div className="text-xs mt-1.5 px-1" style={{ color: textMuted, opacity: 0.5 }}>
            Enter to send · Shift+Enter for new line
          </div>
        </div>
      </div>
    </>
  );
};
