import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { AgentMessage } from '@/types';

interface AgentStore {
  messages: AgentMessage[];
  loading: boolean;
  streamingContent: string;
  selectedModel: string;
  fetchMessages: (workspaceId?: string) => Promise<void>;
  sendMessage: (content: string, workspaceId?: string) => Promise<void>;
  clearMessages: () => void;
  setModel: (m: string) => void;
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  messages: [],
  loading: false,
  streamingContent: '',
  selectedModel: 'google/gemini-3-flash-preview',

  fetchMessages: async (workspaceId) => {
    let query = supabase
      .from('agent_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);
    if (workspaceId) query = query.eq('workspace_id', workspaceId);
    const { data } = await query;
    if (data) set({ messages: data as AgentMessage[] });
  },

  sendMessage: async (content, workspaceId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Optimistic user message
    const userMsg: AgentMessage = {
      id: crypto.randomUUID(),
      workspace_id: workspaceId,
      user_id: user.id,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };
    set((s) => ({ messages: [...s.messages, userMsg], loading: true, streamingContent: '' }));

    // Persist user message
    await supabase.from('agent_messages').insert({
      workspace_id: workspaceId ?? null,
      user_id: user.id,
      role: 'user',
      content,
    });

    // Build history for the API
    const history = get().messages.map((m) => ({ role: m.role, content: m.content }));

    // ── Streaming via raw fetch → SSE ──────────────────────────────────
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
    const { data: { session } } = await supabase.auth.getSession();
    const authToken = session?.access_token ?? supabaseAnon;

    const endpoint = `${supabaseUrl}/functions/v1/agent-inference`;

    let fullContent = '';
    let streamFailed = false;

    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'apikey': supabaseAnon,
        },
        body: JSON.stringify({
          messages: history,
          model: get().selectedModel,
          workspaceContext: workspaceId ? { workspaceId } : null,
          stream: true,
        }),
      });

      if (!resp.ok || !resp.body) {
        const errText = await resp.text();
        throw new Error(`Agent error ${resp.status}: ${errText.slice(0, 200)}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') continue;
          try {
            const parsed = JSON.parse(payload);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.delta) {
              fullContent += parsed.delta;
              set({ streamingContent: fullContent });
            }
          } catch (parseErr) {
            // skip malformed chunks
            console.warn('SSE parse error:', parseErr);
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown streaming error';
      fullContent = `❌ ${msg}`;
      streamFailed = true;
    }

    // Commit final assistant message
    const assistantMsg: AgentMessage = {
      id: crypto.randomUUID(),
      workspace_id: workspaceId,
      user_id: user.id,
      role: 'assistant',
      content: fullContent || '⚠️ Empty response from agent.',
      model_id: get().selectedModel,
      created_at: new Date().toISOString(),
    };

    set((s) => ({
      messages: [...s.messages, assistantMsg],
      loading: false,
      streamingContent: '',
    }));

    // Persist to Supabase (non-blocking)
    if (!streamFailed) {
      supabase.from('agent_messages').insert({
        workspace_id: workspaceId ?? null,
        user_id: user.id,
        role: 'assistant',
        content: fullContent,
        model_id: get().selectedModel,
      });
    }
  },

  clearMessages: () => set({ messages: [], streamingContent: '' }),
  setModel: (m) => set({ selectedModel: m }),
}));

export const AVAILABLE_MODELS = [
  { id: 'google/gemini-3-flash-preview', label: 'Gemini 3 Flash' },
  { id: 'google/gemini-2.5-flash-lite', label: 'Gemini 2.5 Lite' },
  { id: 'openai/gpt-5-mini', label: 'GPT-5 Mini' },
  { id: 'openai/gpt-5-nano', label: 'GPT-5 Nano' },
];
