import React from 'react';
import { GitCommit, GitPullRequest, Cpu, CheckCircle, Zap, BarChart, AlertCircle, Rocket } from 'lucide-react';
import { MOCK_ACTIVITY } from '@/constants/mockData';
import { MODELS } from '@/constants/models';
import type { ActivityEvent } from '@/types';

const EVENT_CONFIG = {
  commit: { icon: GitCommit, color: '#4285F4', label: 'Commit' },
  pr: { icon: GitPullRequest, color: '#22C55E', label: 'Pull Request' },
  'agent-start': { icon: Cpu, color: '#F97316', label: 'Agent Started' },
  'agent-done': { icon: CheckCircle, color: '#22C55E', label: 'Agent Done' },
  'model-switch': { icon: Zap, color: '#7C3AED', label: 'Model Routed' },
  deploy: { icon: Rocket, color: '#14B8A6', label: 'Deploy' },
  error: { icon: AlertCircle, color: '#EF4444', label: 'Error' },
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

const formatRelativeTime = (date: Date) => {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const EventItem: React.FC<{ event: ActivityEvent; isLast: boolean }> = ({ event, isLast }) => {
  const config = EVENT_CONFIG[event.type];
  const Icon = config.icon;
  const model = event.model ? MODELS.find((m) => m.id === event.model) : null;

  return (
    <div className="flex gap-3">
      {/* Timeline line */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `${config.color}22`, border: `1px solid ${config.color}44` }}>
          <Icon size={13} style={{ color: config.color }} />
        </div>
        {!isLast && <div className="w-px flex-1 mt-1" style={{ background: 'var(--theme-border)', minHeight: '20px' }} />}
      </div>

      {/* Content */}
      <div className={`pb-4 ${isLast ? '' : ''}`} style={{ minWidth: 0, flex: 1 }}>
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <span className="text-sm font-medium leading-tight" style={{ color: 'var(--theme-text)', fontFamily: 'var(--theme-font-sans)' }}>
            {event.title}
          </span>
          <span className="text-xs shrink-0" style={{ color: 'var(--theme-text-muted)' }}>
            {formatRelativeTime(event.timestamp)}
          </span>
        </div>
        <p className="text-xs mb-2" style={{ color: 'var(--theme-text-muted)' }}>
          {event.description}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {event.repo && (
            <span className="text-xs px-1.5 py-0.5 rounded" style={{
              background: 'var(--theme-surface)', border: '1px solid var(--theme-border)',
              color: 'var(--theme-text-muted)', fontFamily: 'var(--theme-font-mono)', borderRadius: 'var(--theme-radius)',
            }}>
              {event.repo}
            </span>
          )}
          {model && (
            <span className="text-xs px-1.5 py-0.5 rounded flex items-center gap-1"
              style={{ background: `${MODEL_COLORS[event.model!]}22`, color: MODEL_COLORS[event.model!], borderRadius: 'var(--theme-radius)' }}>
              <div className="w-1 h-1 rounded-full" style={{ background: MODEL_COLORS[event.model!] }} />
              {model.name}
            </span>
          )}
          <span className="text-xs px-1.5 py-0.5 rounded"
            style={{ background: `${config.color}15`, color: config.color, borderRadius: 'var(--theme-radius)' }}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export const ActivityTimeline: React.FC = () => {
  const sorted = [...MOCK_ACTIVITY].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const stats = {
    commits: MOCK_ACTIVITY.filter((e) => e.type === 'commit').length,
    prs: MOCK_ACTIVITY.filter((e) => e.type === 'pr').length,
    agentActions: MOCK_ACTIVITY.filter((e) => e.type === 'agent-start' || e.type === 'agent-done').length,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b shrink-0" style={{ borderColor: 'var(--theme-border)' }}>
        <h2 className="text-base font-bold mb-1" style={{ color: 'var(--theme-text)', fontFamily: 'var(--theme-font-sans)' }}>
          Activity Timeline
        </h2>
        <div className="flex gap-4 text-xs" style={{ color: 'var(--theme-text-muted)' }}>
          <span><span style={{ color: '#4285F4' }}>●</span> {stats.commits} commits</span>
          <span><span style={{ color: '#22C55E' }}>●</span> {stats.prs} PRs</span>
          <span><span style={{ color: '#F97316' }}>●</span> {stats.agentActions} agent events</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
        <div className="space-y-0">
          {sorted.map((event, i) => (
            <EventItem key={event.id} event={event} isLast={i === sorted.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
};
