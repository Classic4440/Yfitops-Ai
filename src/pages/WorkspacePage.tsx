import React, { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useAgentStore } from '@/stores/agentStore';
import { useThemeStore } from '@/stores/themeStore';
import { TopNav } from '@/components/layout/TopNav';
import { AgentChat } from '@/components/features/AgentChat';
import { CodeView } from '@/components/features/CodeView';
import { TerminalPanel } from '@/components/features/TerminalPanel';
import { ReposGrid } from '@/components/features/ReposGrid';
import { SettingsPage } from '@/pages/SettingsPage';
import { AnalyticsView } from '@/components/features/AnalyticsView';

const CenterView: React.FC = () => {
  const { activeTab } = useUIStore();
  switch (activeTab) {
    case 'chat': return <AgentChat />;
    case 'editor': return <CodeView />;
    case 'terminal': return <TerminalPanel />;
    case 'repos': return <ReposGrid />;
    case 'analytics': return <AnalyticsView />;
    case 'settings': return <SettingsPage />;
    default: return <AgentChat />;
  }
};

export const WorkspacePage: React.FC = () => {
  const { terminalOpen } = useUIStore();
  const { theme } = useThemeStore();
  const { fetchWorkspaces } = useWorkspaceStore();
  const { fetchMessages } = useAgentStore();

  useEffect(() => {
    fetchWorkspaces();
    fetchMessages();
  }, []);

  return (
    <div className="flex flex-col h-full" style={{ background: theme.bg }}>
      <TopNav />
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0">
          <CenterView />
        </div>
        {terminalOpen && (
          <div className="h-56 border-t flex-shrink-0" style={{ borderColor: theme.border }}>
            <TerminalPanel />
          </div>
        )}
      </div>
    </div>
  );
};
