import type { AgentSession, Repository, ActivityEvent, ChatMessage } from '@/types';

export const MOCK_AGENTS: AgentSession[] = [
  {
    id: 'agent-001',
    name: 'Auth Refactor Agent',
    repo: 'yfitops/core-api',
    branch: 'feat/auth-refactor',
    task: 'Refactor authentication module to use JWT refresh tokens and implement rate limiting middleware',
    model: 'claude-sonnet',
    status: 'running',
    progress: 67,
    elapsed: '14m 32s',
    commits: 3,
    linesChanged: 247,
    createdAt: new Date(Date.now() - 872000),
  },
  {
    id: 'agent-002',
    name: 'UI Component Agent',
    repo: 'yfitops/frontend',
    branch: 'feat/dashboard-v2',
    task: 'Build responsive dashboard with Recharts analytics, dark mode support, and mobile-first layout',
    model: 'gemini-flash',
    status: 'planning',
    progress: 23,
    elapsed: '4m 11s',
    commits: 1,
    linesChanged: 84,
    createdAt: new Date(Date.now() - 251000),
  },
  {
    id: 'agent-003',
    name: 'Test Coverage Agent',
    repo: 'yfitops/core-api',
    branch: 'feat/test-coverage',
    task: 'Generate comprehensive unit tests for all service layer functions; achieve 90%+ coverage',
    model: 'deepseek-v3',
    status: 'running',
    progress: 89,
    elapsed: '31m 05s',
    commits: 7,
    linesChanged: 1203,
    createdAt: new Date(Date.now() - 1865000),
  },
  {
    id: 'agent-004',
    name: 'Documentation Agent',
    repo: 'yfitops/docs',
    branch: 'feat/api-docs',
    task: 'Generate OpenAPI 3.1 specification from existing route handlers and write developer guides',
    model: 'gemini-cli',
    status: 'done',
    progress: 100,
    elapsed: '22m 18s',
    commits: 4,
    linesChanged: 892,
    createdAt: new Date(Date.now() - 5200000),
  },
  {
    id: 'agent-005',
    name: 'Security Audit Agent',
    repo: 'yfitops/core-api',
    branch: 'fix/security-audit',
    task: 'Run SAST analysis, fix SQL injection vulnerabilities, update dependencies with CVEs',
    model: 'claude-sonnet',
    status: 'waiting',
    progress: 0,
    elapsed: '0s',
    commits: 0,
    linesChanged: 0,
    createdAt: new Date(Date.now() - 60000),
  },
  {
    id: 'agent-006',
    name: 'Perf Optimization Agent',
    repo: 'yfitops/frontend',
    branch: 'perf/bundle-optimization',
    task: 'Implement code splitting, lazy loading, and reduce initial bundle size by 40%',
    model: 'gpt-5',
    status: 'error',
    progress: 45,
    elapsed: '8m 44s',
    commits: 2,
    linesChanged: 156,
    createdAt: new Date(Date.now() - 524000),
  },
];

export const MOCK_REPOS: Repository[] = [
  {
    id: 'repo-001',
    name: 'core-api',
    fullName: 'yfitops/core-api',
    description: 'Main backend API service with authentication, database, and business logic',
    language: 'TypeScript',
    stars: 1247,
    updatedAt: '2 hours ago',
    isPrivate: false,
    branch: 'main',
    activeAgents: 2,
    openPRs: 4,
  },
  {
    id: 'repo-002',
    name: 'frontend',
    fullName: 'yfitops/frontend',
    description: 'React + TypeScript frontend with Tailwind CSS and comprehensive UI components',
    language: 'TypeScript',
    stars: 892,
    updatedAt: '45 minutes ago',
    isPrivate: false,
    branch: 'main',
    activeAgents: 2,
    openPRs: 2,
  },
  {
    id: 'repo-003',
    name: 'docs',
    fullName: 'yfitops/docs',
    description: 'Developer documentation, API references, and getting started guides',
    language: 'MDX',
    stars: 234,
    updatedAt: '1 day ago',
    isPrivate: false,
    branch: 'main',
    activeAgents: 0,
    openPRs: 1,
  },
  {
    id: 'repo-004',
    name: 'agent-runtime',
    fullName: 'yfitops/agent-runtime',
    description: 'Core agent orchestration engine with LangChain.js and MCP integrations',
    language: 'TypeScript',
    stars: 3891,
    updatedAt: '3 days ago',
    isPrivate: false,
    branch: 'main',
    activeAgents: 0,
    openPRs: 7,
  },
  {
    id: 'repo-005',
    name: 'mcp-servers',
    fullName: 'yfitops/mcp-servers',
    description: 'Collection of 650+ MCP servers for tools, integrations, and agent capabilities',
    language: 'Python',
    stars: 5612,
    updatedAt: '6 hours ago',
    isPrivate: false,
    branch: 'main',
    activeAgents: 0,
    openPRs: 12,
  },
  {
    id: 'repo-006',
    name: 'sandbox-runtime',
    fullName: 'yfitops/sandbox-runtime',
    description: 'WebContainers and E2B sandbox management for in-browser code execution',
    language: 'TypeScript',
    stars: 678,
    updatedAt: '1 week ago',
    isPrivate: true,
    branch: 'develop',
    activeAgents: 0,
    openPRs: 3,
  },
];

export const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: 'evt-001',
    type: 'commit',
    title: 'feat: implement JWT refresh token rotation',
    description: 'Auth Refactor Agent committed 3 files, +124 -48 lines',
    repo: 'yfitops/core-api',
    model: 'claude-sonnet',
    timestamp: new Date(Date.now() - 120000),
    agentId: 'agent-001',
  },
  {
    id: 'evt-002',
    type: 'agent-start',
    title: 'UI Component Agent started',
    description: 'Spawned on feat/dashboard-v2 using Gemini 2.5 Flash',
    repo: 'yfitops/frontend',
    model: 'gemini-flash',
    timestamp: new Date(Date.now() - 251000),
    agentId: 'agent-002',
  },
  {
    id: 'evt-003',
    type: 'pr',
    title: 'PR #47: Complete API documentation',
    description: 'Documentation Agent opened draft PR with 892 lines of OpenAPI spec',
    repo: 'yfitops/docs',
    model: 'gemini-cli',
    timestamp: new Date(Date.now() - 600000),
    agentId: 'agent-004',
  },
  {
    id: 'evt-004',
    type: 'agent-done',
    title: 'Documentation Agent completed',
    description: 'Finished generating OpenAPI 3.1 spec and developer guides',
    repo: 'yfitops/docs',
    model: 'gemini-cli',
    timestamp: new Date(Date.now() - 620000),
    agentId: 'agent-004',
  },
  {
    id: 'evt-005',
    type: 'model-switch',
    title: 'Model routed: DeepSeek V3 → Test coverage',
    description: 'Router selected free DeepSeek V3 for large-scale test generation task',
    repo: 'yfitops/core-api',
    model: 'deepseek-v3',
    timestamp: new Date(Date.now() - 1865000),
    agentId: 'agent-003',
  },
  {
    id: 'evt-006',
    type: 'error',
    title: 'Perf Optimization Agent encountered an error',
    description: 'Tree-shaking config conflicted with dynamic imports — awaiting user decision',
    repo: 'yfitops/frontend',
    model: 'gpt-5',
    timestamp: new Date(Date.now() - 524000),
    agentId: 'agent-006',
  },
  {
    id: 'evt-007',
    type: 'commit',
    title: 'test: add 847 unit tests for service layer',
    description: 'Test Coverage Agent: coverage now at 89.3%',
    repo: 'yfitops/core-api',
    model: 'deepseek-v3',
    timestamp: new Date(Date.now() - 900000),
    agentId: 'agent-003',
  },
  {
    id: 'evt-008',
    type: 'deploy',
    title: 'Deploy preview ready',
    description: 'Preview URL generated for feat/dashboard-v2 branch',
    repo: 'yfitops/frontend',
    model: 'gemini-flash',
    timestamp: new Date(Date.now() - 1200000),
    agentId: 'agent-002',
  },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-001',
    role: 'user',
    content: 'Refactor the authentication module to use JWT refresh tokens with automatic rotation. Add rate limiting middleware at 100 req/min per IP.',
    timestamp: new Date(Date.now() - 900000),
  },
  {
    id: 'msg-002',
    role: 'assistant',
    content: `**Plan approved. Starting implementation.**

I'll break this into 4 subtasks:

1. **JWT Service** — Create refresh token generation, validation, and rotation logic
2. **Token Store** — Redis-backed storage for refresh token allowlist  
3. **Rate Limiting** — express-rate-limit middleware with sliding window algorithm
4. **Auth Middleware** — Update existing middleware to handle token refresh flow

Starting with the JWT Service module. I'll commit each subtask separately with conventional commits.

\`\`\`typescript
// auth/jwt.service.ts — implementing now
export class JWTService {
  private readonly ACCESS_EXPIRY = '15m';
  private readonly REFRESH_EXPIRY = '7d';
  ...
}
\`\`\`

_Routed to Claude Sonnet 4.5 — complex multi-file refactor detected_`,
    model: 'claude-sonnet',
    timestamp: new Date(Date.now() - 890000),
    tokens: 1240,
    mode: 'normal',
  },
  {
    id: 'msg-003',
    role: 'user',
    content: 'Also add a comprehensive test suite. Target 90%+ coverage.',
    timestamp: new Date(Date.now() - 800000),
  },
  {
    id: 'msg-004',
    role: 'assistant',
    content: `**Spawning Test Coverage Agent.**

Launching a parallel sub-agent on branch \`feat/test-coverage\` using DeepSeek V3 (free tier).

The Test Coverage Agent will:
- Generate unit tests for all service functions
- Mock external dependencies (Redis, DB)  
- Run Jest with \`--coverage\` and iterate until 90%+ achieved
- Auto-commit with \`test:\` conventional commits

You can monitor it in the **Agent Manager** panel. I'll continue with the auth refactor on this session.

_Parallel sub-agent spawned: Test Coverage Agent → DeepSeek V3 (free)_`,
    model: 'claude-sonnet',
    timestamp: new Date(Date.now() - 790000),
    tokens: 890,
    mode: 'normal',
  },
];
