import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Workspace } from '@/types';

interface WorkspaceStore {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
  fetchWorkspaces: () => Promise<void>;
  setCurrentWorkspace: (w: Workspace | null) => void;
  addWorkspace: (w: Omit<Workspace, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  loading: false,

  fetchWorkspaces: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      set({ workspaces: data as Workspace[], loading: false });
      if (!get().currentWorkspace && data.length > 0) {
        set({ currentWorkspace: data[0] as Workspace });
      }
    } else {
      set({ loading: false });
    }
  },

  setCurrentWorkspace: (w) => set({ currentWorkspace: w }),

  addWorkspace: async (payload) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from('workspaces')
      .insert({ ...payload, user_id: user.id })
      .select()
      .single();
    if (!error && data) {
      set((s) => ({ workspaces: [data as Workspace, ...s.workspaces], currentWorkspace: data as Workspace }));
    }
  },

  deleteWorkspace: async (id) => {
    await supabase.from('workspaces').delete().eq('id', id);
    set((s) => ({
      workspaces: s.workspaces.filter((w) => w.id !== id),
      currentWorkspace: s.currentWorkspace?.id === id ? null : s.currentWorkspace,
    }));
  },
}));
