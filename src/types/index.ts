// ─── Auth ──────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

// ─── Theme ─────────────────────────────────────────────────────────────────
export interface ThemeDefinition {
  id: string;
  label: string;
  bg: string;
  surface: string;
  border: string;
  accent: string;
  accentFg: string;
  text: string;
  textMuted: string;
  fontMono: string;
  fontSans: string;
  radius: string;
}

// ─── Workspace ─────────────────────────────────────────────────────────────
export interface Workspace {
  id: string;
  user_id: string;
  repo_name: string;
  repo_url: string;
  repo_full_name?: string;
  default_branch?: string;
  local_path?: string;
  last_synced?: string;
  created_at: string;
}

// ─── Agent Message ─────────────────────────────────────────────────────────
export interface AgentMessage {
  id: string;
  workspace_id?: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model_id?: string;
  tokens?: number;
  created_at: string;
}

// ─── Execution ─────────────────────────────────────────────────────────────
export interface Execution {
  id: string;
  workspace_id?: string;
  user_id: string;
  command?: string;
  output?: string;
  exit_code?: number;
  started_at: string;
  finished_at?: string;
  agent_triggered?: boolean;
}

// ─── File tree ─────────────────────────────────────────────────────────────
export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

// ─── UI ────────────────────────────────────────────────────────────────────
export type NavTab = 'chat' | 'editor' | 'terminal' | 'repos' | 'analytics' | 'settings';

export interface UIState {
  activeTab: NavTab;
  showSidebar: boolean;
  sidebarPane: 'files' | 'git';
  terminalOpen: boolean;
}
