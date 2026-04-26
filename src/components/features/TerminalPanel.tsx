import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X, ChevronRight, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useThemeStore } from '@/stores/themeStore';
import { FunctionsHttpError } from '@supabase/supabase-js';

interface Line {
  id: string;
  text: string;
  type: 'command' | 'output' | 'error' | 'info';
}

const GIT_OPS = ['status', 'log', 'add', 'commit', 'branch', 'checkout', 'push', 'pull', 'clone', 'diff', 'stash'];

export const TerminalPanel: React.FC = () => {
  const { currentWorkspace } = useWorkspaceStore();
  const { theme } = useThemeStore();
  const [lines, setLines] = useState<Line[]>([
    { id: '0', text: '─── YfitOps Terminal ───────────────────────────────────', type: 'info' },
    { id: '1', text: 'Commands are routed to real git-operations Edge Function.', type: 'info' },
    { id: '2', text: 'Type  help  for usage guide.', type: 'info' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [running, setRunning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addLine = (text: string, type: Line['type']) =>
    setLines((prev) => [...prev, { id: crypto.randomUUID(), text, type }]);

  const run = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;
    addLine(`$ ${trimmed}`, 'command');
    setHistory((h) => [trimmed, ...h.slice(0, 49)]);
    setHistIdx(-1);
    setRunning(true);

    const workspaceId = currentWorkspace?.id;

    try {
      if (trimmed === 'clear') {
        setLines([]);
        setRunning(false);
        return;
      }

      if (trimmed === 'help') {
        addLine('Git commands:', 'info');
        addLine('  git status | git log | git diff | git stash', 'info');
        addLine('  git add . | git add <file>', 'info');
        addLine('  git commit -m "message"', 'info');
        addLine('  git branch | git branch <name> | git checkout <branch>', 'info');
        addLine('  git push | git pull', 'info');
        addLine('  git clone <url>', 'info');
        addLine('Other: clear, help', 'info');
        addLine('Note: a workspace must be active to run git operations.', 'info');
        setRunning(false);
        return;
      }

      // Git commands — routed to real Edge Function
      const parts = trimmed.split(/\s+/);
      if (parts[0] === 'git' && GIT_OPS.includes(parts[1])) {
        if (!workspaceId) {
          addLine('No active workspace. Create or select a workspace first.', 'error');
          setRunning(false);
          return;
        }

        const operation = parts[1];
        const args: Record<string, unknown> = {};

        if (operation === 'commit') {
          const mIdx = parts.indexOf('-m');
          args.message = mIdx >= 0
            ? parts.slice(mIdx + 1).join(' ').replace(/^["']|["']$/g, '')
            : 'chore: update';
        }
        if (operation === 'branch' && parts[2]) args.name = parts[2];
        if (operation === 'checkout' && parts[2]) args.branch = parts[2];
        if (operation === 'add') args.files = parts.slice(2).length ? parts.slice(2) : ['.'];
        if (operation === 'clone' && parts[2]) args.url = parts[2];

        const { data, error } = await supabase.functions.invoke('git-operations', {
          body: { workspaceId, operation, args },
        });

        if (error) {
          let msg = error.message;
          if (error instanceof FunctionsHttpError) {
            try { msg = await error.context.text(); } catch { /* ignore */ }
          }
          addLine(`Error: ${msg}`, 'error');
        } else {
          const out = data?.output ?? data?.result ?? 'Done.';
          out.split('\n').filter(Boolean).forEach((l: string) => addLine(l, 'output'));
        }
      } else {
        addLine(`Unknown command: "${parts[0]}". Type  help  for usage.`, 'error');
        addLine('Tip: real command execution requires WebContainer integration.', 'info');
      }
    } catch (err: unknown) {
      addLine(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`, 'error');
    }

    setRunning(false);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { run(input); setInput(''); }
    else if (e.key === 'ArrowUp') {
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? '');
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? '' : history[idx]);
      e.preventDefault();
    }
  };

  const { bg, surface, border, accent, text, textMuted, fontMono, radius } = theme;
  const typeColor: Record<Line['type'], string> = {
    command: accent,
    output: text,
    error: '#FF6B6B',
    info: textMuted,
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: bg, fontFamily: fontMono }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2 border-b flex-shrink-0"
        style={{ borderColor: border, background: surface }}
      >
        <Terminal size={14} style={{ color: accent }} />
        <span className="text-xs font-semibold" style={{ color: text }}>Terminal</span>
        {currentWorkspace && (
          <span className="text-xs" style={{ color: textMuted }}>— {currentWorkspace.repo_name}</span>
        )}
        {!currentWorkspace && (
          <span
            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
            style={{ background: '#F59E0B22', color: '#F59E0B', borderRadius: radius }}
          >
            <Info size={10} /> No workspace
          </span>
        )}
        {running && (
          <span className="text-xs ml-auto" style={{ color: accent }}>running…</span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setLines([]); }}
          className="ml-auto hover:opacity-70 transition-opacity"
          style={{ color: textMuted }}
          title="Clear output"
        >
          <X size={12} />
        </button>
      </div>

      {/* Output */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-0.5">
        {lines.map((line) => (
          <div
            key={line.id}
            className="text-xs leading-5 whitespace-pre-wrap"
            style={{ color: typeColor[line.type] }}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 px-4 py-2 border-t flex-shrink-0"
        style={{ borderColor: border, background: surface }}
      >
        <ChevronRight size={12} style={{ color: accent }} />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={currentWorkspace ? 'Type a git command…' : 'Select a workspace first…'}
          className="flex-1 bg-transparent outline-none text-xs"
          style={{ color: text, fontFamily: fontMono }}
          disabled={running}
          autoFocus
        />
      </div>
    </div>
  );
};
