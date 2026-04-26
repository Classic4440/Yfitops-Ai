import React, { useState } from 'react';
import {
  MessageSquare, Code2, Terminal, GitBranch, BarChart2, Settings, Menu, X, PanelBottom, Plus,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useThemeStore } from '@/stores/themeStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import type { NavTab } from '@/types';

const NAV_ITEMS: { id: NavTab; icon: React.FC<{ size?: number }>; label: string }[] = [
  { id: 'chat', icon: MessageSquare, label: 'Chat' },
  { id: 'editor', icon: Code2, label: 'Editor' },
  { id: 'terminal', icon: Terminal, label: 'Terminal' },
  { id: 'repos', icon: GitBranch, label: 'Repos' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

interface WorkspaceModalProps {
  onClose: () => void;
}

const NewWorkspaceModal: React.FC<WorkspaceModalProps> = ({ onClose }) => {
  const { theme } = useThemeStore();
  const { addWorkspace } = useWorkspaceStore();
  const [form, setForm] = useState({ repo_name: '', repo_url: '', repo_full_name: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { bg, surface, border, accent, accentFg, text, textMuted, radius, fontSans } = theme;

  const handleAdd = async () => {
    if (!form.repo_name.trim()) { setError('Repository name is required.'); return; }
    if (!form.repo_url.trim()) { setError('Repository URL is required.'); return; }
    setSaving(true);
    setError('');
    try {
      await addWorkspace({
        repo_name: form.repo_name.trim(),
        repo_url: form.repo_url.trim(),
        repo_full_name: form.repo_full_name.trim() || undefined as any,
        default_branch: 'main',
        local_path: null as any,
        last_synced: null as any,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to create workspace.');
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    background: bg,
    border: `1px solid ${border}`,
    color: text,
    borderRadius: radius,
    width: '100%',
    padding: '9px 12px',
    fontSize: 13,
    outline: 'none',
    fontFamily: fontSans,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.55)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md shadow-2xl"
        style={{ background: surface, border: `1px solid ${border}`, borderRadius: radius, fontFamily: fontSans }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4" style={{ borderBottom: `1px solid ${border}` }}>
          <div>
            <h3 className="text-base font-bold" style={{ color: text }}>New Workspace</h3>
            <p className="text-xs mt-0.5" style={{ color: textMuted }}>Connect a GitHub repository to your workspace</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:opacity-70 transition-opacity"
            style={{ color: textMuted, background: bg, border: `1px solid ${border}`, borderRadius: radius }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {error && (
            <div
              className="text-sm px-3 py-2 rounded"
              style={{ background: '#FF6B6B22', color: '#FF6B6B', borderRadius: radius }}
            >
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: textMuted }}>
              Repository Name <span style={{ color: accent }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. my-app"
              value={form.repo_name}
              onChange={(e) => setForm((f) => ({ ...f, repo_name: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              style={inputStyle}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: textMuted }}>
              Repository URL <span style={{ color: accent }}>*</span>
            </label>
            <input
              type="url"
              placeholder="https://github.com/user/my-app"
              value={form.repo_url}
              onChange={(e) => setForm((f) => ({ ...f, repo_url: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: textMuted }}>
              Full Name <span style={{ color: textMuted }}>(optional)</span>
            </label>
            <input
              type="text"
              placeholder="user/my-app"
              value={form.repo_full_name}
              onChange={(e) => setForm((f) => ({ ...f, repo_full_name: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-5 pb-5 pt-3"
          style={{ borderTop: `1px solid ${border}` }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded transition-opacity hover:opacity-70"
            style={{ background: bg, border: `1px solid ${border}`, color: textMuted, borderRadius: radius }}
          >
            Cancel
          </button>
          <button
            disabled={saving || !form.repo_name || !form.repo_url}
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded transition-opacity disabled:opacity-50 hover:opacity-85"
            style={{ background: accent, color: accentFg, borderRadius: radius }}
          >
            <Plus size={13} />
            {saving ? 'Creating…' : 'Create Workspace'}
          </button>
        </div>
      </div>
    </>
  );
};

export const TopNav: React.FC = () => {
  const { activeTab, setActiveTab, showSidebar, toggleSidebar, terminalOpen, toggleTerminal } = useUIStore();
  const { theme } = useThemeStore();
  const { currentWorkspace } = useWorkspaceStore();
  const [showModal, setShowModal] = useState(false);

  const { bg, surface, border, accent, accentFg, text, textMuted, radius } = theme;

  return (
    <>
      <div
        className="flex items-center gap-1 px-3 py-1.5 border-b flex-shrink-0"
        style={{ background: surface, borderColor: border }}
      >
        {/* Logo + sidebar toggle */}
        <div className="flex items-center gap-2 mr-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded hover:opacity-70 transition-opacity"
            style={{ color: textMuted }}
          >
            {showSidebar ? <X size={14} /> : <Menu size={14} />}
          </button>
          <span className="text-sm font-black select-none" style={{ color: accent }}>YfitOps</span>
          {currentWorkspace && (
            <span
              className="text-xs px-2 py-0.5 rounded-full hidden sm:inline truncate max-w-[120px]"
              style={{ background: accent + '22', color: accent }}
            >
              {currentWorkspace.repo_name}
            </span>
          )}
        </div>

        {/* Nav tabs */}
        <div className="flex items-center gap-0.5 flex-1 overflow-x-auto">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all hover:opacity-80 flex-shrink-0"
                style={{
                  background: isActive ? accent : 'transparent',
                  color: isActive ? accentFg : textMuted,
                  borderRadius: radius,
                }}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 ml-2">
          {/* New Workspace button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition-all hover:opacity-80"
            style={{
              background: accent + '18',
              color: accent,
              borderRadius: radius,
              border: `1px solid ${accent}40`,
            }}
            title="New workspace"
          >
            <Plus size={12} />
            <span className="hidden md:inline">Workspace</span>
          </button>

          {/* Terminal toggle */}
          <button
            onClick={toggleTerminal}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-all hover:opacity-80"
            style={{
              background: terminalOpen ? accent + '22' : 'transparent',
              color: terminalOpen ? accent : textMuted,
              borderRadius: radius,
            }}
            title="Toggle terminal panel"
          >
            <PanelBottom size={12} />
            <span className="hidden md:inline">Terminal</span>
          </button>
        </div>
      </div>

      {/* New Workspace Modal */}
      {showModal && <NewWorkspaceModal onClose={() => setShowModal(false)} />}
    </>
  );
};
