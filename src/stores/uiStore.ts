import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NavTab } from '@/types';

export type LayoutMode = 'default' | 'split' | 'focus' | 'minimal';
export type DensityMode = 'compact' | 'comfortable';

interface UIStore {
  activeTab: NavTab;
  showSidebar: boolean;
  sidebarPane: 'files' | 'git';
  terminalOpen: boolean;
  showLanding: boolean;
  layoutMode: LayoutMode;
  density: DensityMode;
  setActiveTab: (tab: NavTab) => void;
  toggleSidebar: () => void;
  setSidebarPane: (p: 'files' | 'git') => void;
  toggleTerminal: () => void;
  setShowLanding: (v: boolean) => void;
  setLayoutMode: (m: LayoutMode) => void;
  setDensity: (d: DensityMode) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      activeTab: 'chat',
      showSidebar: true,
      sidebarPane: 'files',
      terminalOpen: false,
      showLanding: true,
      layoutMode: 'default',
      density: 'comfortable',
      setActiveTab: (tab) => set({ activeTab: tab }),
      toggleSidebar: () => set((s) => ({ showSidebar: !s.showSidebar })),
      setSidebarPane: (p) => set({ sidebarPane: p }),
      toggleTerminal: () => set((s) => ({ terminalOpen: !s.terminalOpen })),
      setShowLanding: (v) => set({ showLanding: v }),
      setLayoutMode: (m) => set({ layoutMode: m }),
      setDensity: (d) => set({ density: d }),
    }),
    {
      name: 'yfitops-ui',
      partialMerge: true,
      partialize: (s) => ({
        layoutMode: s.layoutMode,
        density: s.density,
        activeTab: s.activeTab,
      }),
    } as Parameters<typeof persist>[1]
  )
);
