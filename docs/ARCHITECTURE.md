# YfitOps AI — Architecture

## What This Is

An AI operating system, not a website.

Every action must be real and executable. No mock data. No fake responses.

---

## Core Systems

### 1. Agent Runtime (THE BRAIN)

**File**: `supabase/functions/agent-inference/index.ts`

Implements a real agentic tool-calling loop:

```
while (not_done && iterations < MAX) {
  aiResponse = call_model(messages + context)

  if (aiResponse.tool_calls) {
    for (tool of tool_calls) {
      result = executeTool(tool.name, tool.args)
      messages.push(tool_result)
    }
  } else {
    finalContent = aiResponse.content
    break
  }
}
```

Max iterations: 6. On the last iteration, tools are disabled to force a text response.

### 2. Tool System (THE HANDS)

Tools are defined as OpenAI-compatible function schemas and executed via the backend Edge Functions.

| Tool Name | Description | Routes To |
|---|---|---|
| `terminal_execute` | Run any shell command | `git-operations` Edge Fn |
| `files_read` | Read file content | `file-operations` Edge Fn |
| `files_write` | Write/create a file | `file-operations` Edge Fn |
| `git_commit` | Stage + commit changes | `git-operations` Edge Fn |
| `git_clone` | Clone a repository | `git-operations` Edge Fn |

**Tool interface** (TypeScript):
```ts
type Tool = {
  name: string
  description: string
  execute: (input: Record<string, unknown>) => Promise<string>
}
```

### 3. Execution Layer

**Current**: Git/file operations via Supabase Edge Functions (Deno).
**Next**: WebContainer integration for real in-browser Node.js runtime.

WebContainers (free, by StackBlitz) provide:
- Real Node.js runtime in the browser
- Real filesystem accessible by the agent
- Real npm, git, and shell commands
- Zero server cost ($0)

### 4. Supabase Persistence

| Table | Purpose |
|---|---|
| `workspaces` | Connected GitHub repos / project sandboxes |
| `executions` | Terminal command history with output + exit codes |
| `agent_messages` | Full chat history per workspace per user |

All tables have Row-Level Security (RLS) — users only see their own data.

---

## AI Layer

### Model Strategy

**Default**: `google/gemini-3-flash-preview` (fast, strong reasoning)
**Available**: GPT-5 Mini, GPT-5 Nano, Gemini 2.5 Flash Lite

### Expert Mode (Multi-model Thinking)
```ts
const draft    = await model_A(prompt)
const critique = await model_B(`Critique this:\n${draft}`)
const final    = await model_A(`Improve using this critique:\n${critique}`)
```

Not yet implemented. Add a toggle in Settings → AI Behavior → "Expert Mode".

---

## UI System

### Layout Engine

Stored in `uiStore.ts` via Zustand persist.

```ts
type LayoutMode  = 'default' | 'split' | 'focus' | 'minimal'
type DensityMode = 'compact' | 'comfortable'
```

`WorkspacePage.tsx` conditionally renders layout based on `layoutMode`.

### Themes

12 brand-inspired themes defined in `src/constants/themes.ts`.
Each theme is a plain JS object with color tokens — no CSS variables, no class swapping.
Components consume `useThemeStore().theme` inline style props.

---

## Backend Architecture

```
Frontend (React + Vite)
  │
  └── Supabase Client SDK
        │
        ├── supabase.functions.invoke('agent-inference')
        │     └── OnSpace AI (Gemini / GPT-5 / etc.)
        │           └── tool_calls → executeTool()
        │                 ├── supabase.functions.invoke('git-operations')
        │                 └── supabase.functions.invoke('file-operations')
        │
        ├── supabase.from('agent_messages').select/insert
        ├── supabase.from('workspaces').select/insert/delete
        └── supabase.auth.signInWithPassword / signInWithOtp
```

---

## Principles

1. **No mock data** — every repo, message, and terminal output comes from real API calls.
2. **All actions must be executable** — if the agent says "run npm install", it must actually run it.
3. **AI must control tools, not just respond** — the agent loop picks up tool calls and executes them.
4. **Free tier first** — OnSpace AI (no key required), Supabase free tier, WebContainers (free).
5. **Trust through transparency** — show real errors, real loading states, real output.

---

## Roadmap

### Phase 1 — Real AI ✅
- [x] Move AI call to Edge Function
- [x] Remove mock responses
- [x] SSE streaming to client

### Phase 2 — Agent Loop ✅
- [x] Tool definitions (terminal, files, git)
- [x] Tool-calling loop in Edge Function (max 6 iterations)
- [x] Tool results fed back into context

### Phase 3 — Real Execution (Next)
- [ ] Integrate WebContainers for true in-browser Node.js
- [ ] Connect terminal to WebContainer shell
- [ ] File tree reads from WebContainer FS

### Phase 4 — UX
- [x] Code copy buttons
- [x] Streaming live typing effect
- [x] Layout switcher (default / split / focus / minimal)
- [x] Density toggle (compact / comfortable)
- [ ] Command palette (Cmd+K) with "Run agent task", "Switch layout", "Open file"

### Phase 5 — Multi-model Expert Mode
- [ ] Expert mode toggle in Settings
- [ ] Draft → Critique → Refine loop using two models
- [ ] Show reasoning steps inline in chat

---

## File Map

```
src/
├── components/features/
│   ├── AgentChat.tsx        # Chat UI + streaming + copy buttons
│   ├── CodeView.tsx         # File explorer + inline editor
│   ├── TerminalPanel.tsx    # Git terminal (real Edge Fn calls)
│   ├── ReposGrid.tsx        # Workspace/repo management
│   └── AnalyticsView.tsx    # Real Supabase analytics
├── stores/
│   ├── agentStore.ts        # Messages, streaming, model selection
│   ├── workspaceStore.ts    # Workspace CRUD via Supabase
│   ├── uiStore.ts           # Layout, density, tab state (persisted)
│   └── themeStore.ts        # Active theme (persisted)
├── pages/
│   ├── LoginPage.tsx        # Sign-in + OTP sign-up
│   ├── WorkspacePage.tsx    # Main IDE shell
│   └── SettingsPage.tsx     # Theme, layout, model, data settings
└── constants/
    └── themes.ts            # 12 theme definitions

supabase/functions/
├── agent-inference/         # AI + tool-calling loop
├── git-operations/          # Git CLI wrapper
├── file-operations/         # File system CRUD
└── _shared/cors.ts          # Shared CORS headers
```
