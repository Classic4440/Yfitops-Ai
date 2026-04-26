import React, { useState, useEffect } from 'react';
import { FileText, Folder, FolderOpen, ChevronRight, Save, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useThemeStore } from '@/stores/themeStore';
import { FunctionsHttpError } from '@supabase/supabase-js';
import type { FileNode } from '@/types';

function FileTree({
  nodes,
  depth,
  onSelect,
  selectedPath,
  theme,
}: {
  nodes: FileNode[];
  depth: number;
  onSelect: (path: string) => void;
  selectedPath: string;
  theme: ReturnType<typeof useThemeStore>['theme'];
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <>
      {nodes.map((node) => (
        <div key={node.path}>
          <button
            className="flex items-center gap-1.5 w-full text-left px-2 py-0.5 text-xs rounded hover:opacity-80 transition-opacity"
            style={{
              paddingLeft: `${8 + depth * 12}px`,
              color: node.path === selectedPath ? theme.accent : theme.text,
              background: node.path === selectedPath ? theme.accent + '15' : 'transparent',
            }}
            onClick={() => {
              if (node.type === 'directory') setOpen((o) => ({ ...o, [node.path]: !o[node.path] }));
              else onSelect(node.path);
            }}
          >
            {node.type === 'directory' ? (
              <>
                <ChevronRight size={10} style={{ transform: open[node.path] ? 'rotate(90deg)' : 'none', transition: 'transform 0.1s' }} />
                {open[node.path] ? <FolderOpen size={12} /> : <Folder size={12} />}
              </>
            ) : (
              <>
                <span className="w-2.5 inline-block" />
                <FileText size={12} />
              </>
            )}
            <span className="truncate">{node.name}</span>
          </button>
          {node.type === 'directory' && open[node.path] && node.children && (
            <FileTree nodes={node.children} depth={depth + 1} onSelect={onSelect} selectedPath={selectedPath} theme={theme} />
          )}
        </div>
      ))}
    </>
  );
}

const LANGUAGE_MAP: Record<string, string> = {
  ts: 'typescript', tsx: 'tsx', js: 'javascript', jsx: 'jsx',
  py: 'python', md: 'markdown', json: 'json', css: 'css',
  html: 'html', sh: 'bash', yaml: 'yaml', yml: 'yaml',
};

export const CodeView: React.FC = () => {
  const { currentWorkspace } = useWorkspaceStore();
  const { theme } = useThemeStore();
  const [tree, setTree] = useState<FileNode[]>([]);
  const [selectedPath, setSelectedPath] = useState('');
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(true);
  const [loading, setLoading] = useState(false);

  const workspaceId = currentWorkspace?.id ?? 'default';

  const loadTree = async () => {
    const { data, error } = await supabase.functions.invoke('file-operations', {
      body: { workspaceId, action: 'list' },
    });
    if (!error && data?.tree) setTree(data.tree);
  };

  const openFile = async (path: string) => {
    setSelectedPath(path);
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('file-operations', {
      body: { workspaceId, action: 'read', path },
    });
    setLoading(false);
    if (!error && data?.content !== undefined) {
      setContent(data.content);
      setSaved(true);
    }
  };

  const saveFile = async () => {
    if (!selectedPath) return;
    await supabase.functions.invoke('file-operations', {
      body: { workspaceId, action: 'write', path: selectedPath, content },
    });
    setSaved(true);
  };

  useEffect(() => { loadTree(); }, [workspaceId]);

  const ext = selectedPath.split('.').pop() ?? '';
  const lang = LANGUAGE_MAP[ext] ?? 'text';

  const { bg, surface, border, accent, text, textMuted, fontMono, radius } = theme;

  return (
    <div className="flex h-full" style={{ background: bg }}>
      {/* Sidebar */}
      <div className="w-44 flex-shrink-0 border-r overflow-y-auto custom-scrollbar py-2" style={{ borderColor: border, background: surface }}>
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-xs font-semibold" style={{ color: textMuted }}>FILES</span>
          <button onClick={loadTree} className="hover:opacity-70 transition-opacity" style={{ color: textMuted }}>
            <RefreshCw size={10} />
          </button>
        </div>
        {tree.length === 0 ? (
          <div className="text-xs px-2" style={{ color: textMuted }}>No files</div>
        ) : (
          <FileTree nodes={tree} depth={0} onSelect={openFile} selectedPath={selectedPath} theme={theme} />
        )}
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedPath ? (
          <>
            {/* Tab bar */}
            <div className="flex items-center justify-between px-4 py-1.5 border-b text-xs" style={{ borderColor: border, background: surface }}>
              <div className="flex items-center gap-2" style={{ color: text }}>
                <FileText size={12} />
                <span style={{ fontFamily: fontMono }}>{selectedPath}</span>
                {!saved && <span style={{ color: accent }}>•</span>}
              </div>
              <button
                onClick={saveFile}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium transition-opacity hover:opacity-80"
                style={{ background: accent + '22', color: accent, borderRadius: radius }}
              >
                <Save size={10} /> Save
              </button>
            </div>

            {/* Code area */}
            {loading ? (
              <div className="flex-1 flex items-center justify-center" style={{ color: textMuted }}>Loading…</div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => { setContent(e.target.value); setSaved(false); }}
                className="flex-1 p-4 outline-none resize-none text-xs custom-scrollbar"
                style={{
                  background: bg,
                  color: text,
                  fontFamily: fontMono,
                  lineHeight: 1.6,
                  tabSize: 2,
                }}
                spellCheck={false}
              />
            )}

            {/* Status bar */}
            <div className="flex items-center justify-between px-4 py-1 text-xs border-t" style={{ borderColor: border, background: surface, color: textMuted }}>
              <span>{lang}</span>
              <span>{saved ? 'Saved' : 'Unsaved changes'}</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2" style={{ color: textMuted }}>
            <FileText size={32} style={{ opacity: 0.3 }} />
            <div className="text-sm">Select a file to edit</div>
          </div>
        )}
      </div>
    </div>
  );
};
