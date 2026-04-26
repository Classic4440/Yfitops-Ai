import React, { useState } from 'react';
import { GitBranch, Plus, Trash2, ExternalLink, RefreshCw } from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useThemeStore } from '@/stores/themeStore';

export const ReposGrid: React.FC = () => {
  const { workspaces, currentWorkspace, fetchWorkspaces, addWorkspace, deleteWorkspace, setCurrentWorkspace } = useWorkspaceStore();
  const { theme } = useThemeStore();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ repo_name: '', repo_url: '', repo_full_name: '' });
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!form.repo_name || !form.repo_url) return;
    setAdding(true);
    await addWorkspace(form);
    setForm({ repo_name: '', repo_url: '', repo_full_name: '' });
    setShowAdd(false);
    setAdding(false);
  };

  const { bg, surface, border, accent, accentFg, text, textMuted, radius } = theme;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6" style={{ background: bg }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold" style={{ color: text }}>Workspaces</h2>
            <p className="text-xs mt-0.5" style={{ color: textMuted }}>Connected GitHub repositories</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchWorkspaces}
              className="p-2 rounded transition-opacity hover:opacity-70"
              style={{ background: surface, border: `1px solid ${border}`, color: textMuted, borderRadius: radius }}
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded transition-opacity hover:opacity-80"
              style={{ background: accent, color: accentFg, borderRadius: radius }}
            >
              <Plus size={14} /> Add Workspace
            </button>
          </div>
        </div>

        {/* Add form */}
        {showAdd && (
          <div
            className="mb-6 p-4 rounded-xl space-y-3"
            style={{ background: surface, border: `1px solid ${border}`, borderRadius: radius }}
          >
            <h3 className="text-sm font-semibold" style={{ color: text }}>New Workspace</h3>
            {[
              { key: 'repo_name', placeholder: 'Repository name (e.g. my-app)', label: 'Name *' },
              { key: 'repo_url', placeholder: 'https://github.com/user/repo', label: 'URL *' },
              { key: 'repo_full_name', placeholder: 'user/repo (optional)', label: 'Full name' },
            ].map(({ key, placeholder, label }) => (
              <div key={key}>
                <label className="text-xs mb-1 block" style={{ color: textMuted }}>{label}</label>
                <input
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 text-sm rounded outline-none"
                  style={{ background: bg, border: `1px solid ${border}`, color: text, borderRadius: radius }}
                />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAdd}
                disabled={adding || !form.repo_name || !form.repo_url}
                className="px-4 py-2 text-sm font-medium rounded disabled:opacity-50 transition-opacity hover:opacity-80"
                style={{ background: accent, color: accentFg, borderRadius: radius }}
              >
                {adding ? 'Adding…' : 'Add'}
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 text-sm rounded transition-opacity hover:opacity-70"
                style={{ background: bg, border: `1px solid ${border}`, color: textMuted, borderRadius: radius }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Workspace cards */}
        {workspaces.length === 0 ? (
          <div className="text-center py-16" style={{ color: textMuted }}>
            <GitBranch size={32} className="mx-auto mb-3 opacity-30" />
            <div className="text-sm">No workspaces yet. Add your first repository above.</div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {workspaces.map((ws) => {
              const isActive = currentWorkspace?.id === ws.id;
              return (
                <div
                  key={ws.id}
                  className="p-4 rounded-xl cursor-pointer transition-all hover:opacity-90"
                  style={{
                    background: surface,
                    border: `1px solid ${isActive ? accent : border}`,
                    borderRadius: radius,
                  }}
                  onClick={() => setCurrentWorkspace(ws)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate" style={{ color: isActive ? accent : text }}>
                        {ws.repo_name}
                      </div>
                      {ws.repo_full_name && (
                        <div className="text-xs mt-0.5 truncate" style={{ color: textMuted }}>{ws.repo_full_name}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <a
                        href={ws.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded hover:opacity-70 transition-opacity"
                        style={{ color: textMuted }}
                      >
                        <ExternalLink size={12} />
                      </a>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteWorkspace(ws.id); }}
                        className="p-1 rounded hover:opacity-70 transition-opacity"
                        style={{ color: textMuted }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <GitBranch size={10} style={{ color: textMuted }} />
                    <span className="text-xs" style={{ color: textMuted }}>{ws.default_branch ?? 'main'}</span>
                    {isActive && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: accent + '22', color: accent }}>
                        Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
