import React, { useState } from 'react';
import {
  Plus, Play, Pause, RotateCcw, ExternalLink, GitBranch, Clock,
  CheckCircle, AlertCircle, Loader, Circle, GitCommit, FileCode
} from 'lucide-react';
import { useAgentStore } from '@/stores/agentStore';
import { MODELS } from '@/constants/models';
import type { AgentSession, AgentStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<AgentStatus, { color: string; label: string; icon: React.ReactNode; pulse: boolean }> = {
  running: { color: '#22C55E', label: 'Running', icon: <Loader size={12} className="animate-spin" />, pulse: true },
  planning: { color: '#F97316', label: 'Planning', icon: <Loader size={12} className="animate-spin" />, pulse: true },
  waiting: { color: '#6B7280', label: 'Waiting', icon: <Circle size={12} />, pulse: false },
  done: { color: '#4285F4', label: 'Done', icon: <CheckCircle size={12} />, pulse: false },
  error: { color: '#EF4444', label: 'Error', icon: <AlertCircle size={12} />, pulse: false },
};

const MODEL_COLORS: Record<string, string> = {
  'claude-sonnet': '#D4A574',
  'gemini-flash': '#4285F4',
  'deepseek-v3': '#7C3AED',
  'gemini-cli': '#34A853',
  'qwen-coder': '#EA4335',
  'gpt-5': '#10A37F',
  'gemini-pro': '#FBBC04',
};

const AgentCard: React.FC<{ agent: AgentSession }> = ({ agent }) => {
  const status = STATUS_CONFIG[agent.status];
  const model = MODELS.find((m) => m.id === agent.model);

  return (
    <div
      className="p-4 rounded border transition-all hover:shadow-lg cursor-pointer group"
      style={{
        background: 'var(--theme-surface)',
        borderColor: agent.status === 'error' ? '#EF444444' : agent.status === 'running' ? `${status.color}33` : 'var(--theme-border)',
        borderRadius: 'var(--theme-radius)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative shrink-0">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: status.color }} />
            {status.pulse && (
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-50" style={{ background: status.color }} />
            )}
          </div>
          <span className="text-sm font-semibold truncate" style={{ color: 'var(--theme-text)', fontFamily: 'var(--theme-font-sans)' }}>
            {agent.name}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: `${status.color}22`, color: status.color }}>
            {status.label}
          </span>
          <button className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all" style={{ color: 'var(--theme-text-muted)' }}>
            <ExternalLink size={11} />
          </button>
        </div>
      </div>

      {/* Task */}
      <p className="text-xs mb-3 line-clamp-2 leading-relaxed" style={{ color: 'var(--theme-text-muted)', fontFamily: 'var(--theme-font-sans)' }}>
        {agent.task}
      </p>

      {/* Progress */}
      {agent.status !== 'waiting' && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--theme-text-muted)' }}>
            <span>Progress</span>
            <span>{agent.progress}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--theme-border)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${agent.progress}%`, background: status.color }}
            />
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-2 text-xs" style={{ color: 'var(--theme-text-muted)' }}>
        <div className="flex items-center gap-1">
          <GitBranch size={10} />
          <span style={{ fontFamily: 'var(--theme-font-mono)' }}>{agent.branch}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={10} />
          <span>{agent.elapsed}</span>
        </div>
        {agent.commits > 0 && (
          <div className="flex items-center gap-1">
            <GitCommit size={10} />
            <span>{agent.commits} commits</span>
          </div>
        )}
        {agent.linesChanged > 0 && (
          <div className="flex items-center gap-1">
            <FileCode size={10} />
            <span>+{agent.linesChanged.toLocaleString()} lines</span>
          </div>
        )}
      </div>

      {/* Model Badge */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: MODEL_COLORS[agent.model] || 'var(--theme-accent)' }} />
          <span className="text-xs" style={{ color: 'var(--theme-text-muted)', fontFamily: 'var(--theme-font-mono)' }}>
            {model?.name || agent.model}
          </span>
          <span className="text-xs px-1 py-0.5 rounded"
            style={{
              background: model?.tier === 'free' ? '#22C55E22' : '#6B728022',
              color: model?.tier === 'free' ? '#22C55E' : '#6B7280',
            }}>
            {model?.tier === 'free' ? 'FREE' : 'KEY'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {agent.status !== 'done' && agent.status !== 'error' && (
            <button className="p-1 rounded transition-all hover:opacity-70" style={{ color: 'var(--theme-text-muted)' }}>
              <Pause size={11} />
            </button>
          )}
          {agent.status === 'error' && (
            <button className="p-1 rounded transition-all hover:opacity-70" style={{ color: '#F97316' }}>
              <RotateCcw size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const AgentManager: React.FC = () => {
  const { agents, spawnAgent } = useAgentStore();
  const [filter, setFilter] = useState<AgentStatus | 'all'>('all');
  const [showSpawnModal, setShowSpawnModal] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newRepo, setNewRepo] = useState('yfitops/frontend');

  const filtered = filter === 'all' ? agents : agents.filter((a) => a.status === filter);

  const counts = {
    all: agents.length,
    running: agents.filter((a) => a.status === 'running').length,
    planning: agents.filter((a) => a.status === 'planning').length,
    waiting: agents.filter((a) => a.status === 'waiting').length,
    done: agents.filter((a) => a.status === 'done').length,
    error: agents.filter((a) => a.status === 'error').length,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Mission Control Header */}
      <div className="px-4 py-3 border-b shrink-0" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold" style={{ color: 'var(--theme-text)', fontFamily: 'var(--theme-font-sans)' }}>
              Mission Control
            </h2>
            <p className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
              {counts.running + counts.planning} active · {counts.done} completed · {counts.error} errors
            </p>
          </div>
          <button
            onClick={() => setShowSpawnModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-all hover:opacity-80"
            style={{ background: 'var(--theme-accent)', color: 'var(--theme-accent-fg)', borderRadius: 'var(--theme-radius)' }}
          >
            <Plus size={13} />
            Spawn Agent
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex gap-1.5 flex-wrap">
          {(['all', 'running', 'planning', 'waiting', 'done', 'error'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-2 py-0.5 rounded text-xs font-medium transition-all capitalize"
              style={{
                background: filter === s ? 'var(--theme-accent)' : 'var(--theme-surface)',
                color: filter === s ? 'var(--theme-accent-fg)' : 'var(--theme-text-muted)',
                border: `1px solid ${filter === s ? 'transparent' : 'var(--theme-border)'}`,
                borderRadius: 'var(--theme-radius)',
              }}
            >
              {s} {counts[s] > 0 && <span>({counts[s]})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Agent Grid */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {filtered.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="text-4xl opacity-20">🤖</div>
            <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>No agents in this state</p>
          </div>
        )}
      </div>

      {/* Spawn Modal */}
      {showSpawnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded shadow-2xl p-6 border"
            style={{ background: 'var(--theme-surface)', borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius)' }}>
            <h3 className="text-base font-bold mb-4" style={{ color: 'var(--theme-text)' }}>Spawn New Agent</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--theme-text-muted)' }}>Repository</label>
                <input
                  value={newRepo}
                  onChange={(e) => setNewRepo(e.target.value)}
                  className="w-full px-3 py-2 rounded text-sm outline-none"
                  style={{
                    background: 'var(--theme-bg)',
                    border: '1px solid var(--theme-border)',
                    color: 'var(--theme-text)',
                    fontFamily: 'var(--theme-font-mono)',
                    borderRadius: 'var(--theme-radius)',
                  }}
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--theme-text-muted)' }}>Task Description</label>
                <textarea
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Describe what the agent should do..."
                  rows={4}
                  className="w-full px-3 py-2 rounded text-sm outline-none resize-none"
                  style={{
                    background: 'var(--theme-bg)',
                    border: '1px solid var(--theme-border)',
                    color: 'var(--theme-text)',
                    fontFamily: 'var(--theme-font-sans)',
                    borderRadius: 'var(--theme-radius)',
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowSpawnModal(false)}
                className="flex-1 py-2 rounded text-sm transition-all"
                style={{ border: '1px solid var(--theme-border)', color: 'var(--theme-text-muted)', borderRadius: 'var(--theme-radius)' }}>
                Cancel
              </button>
              <button
                onClick={() => { if (newTask.trim()) { spawnAgent(newTask, newRepo); setShowSpawnModal(false); setNewTask(''); } }}
                className="flex-1 py-2 rounded text-sm font-semibold transition-all hover:opacity-80"
                style={{ background: 'var(--theme-accent)', color: 'var(--theme-accent-fg)', borderRadius: 'var(--theme-radius)' }}
              >
                <Play size={13} className="inline mr-1.5" />
                Spawn Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
