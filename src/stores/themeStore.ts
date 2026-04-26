import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEMES, DEFAULT_THEME_ID } from '@/constants/themes';
import type { ThemeDefinition } from '@/types';

interface ThemeState {
  activeThemeId: string;
  theme: ThemeDefinition;
  setTheme: (id: string) => void;
}

function applyTheme(t: ThemeDefinition) {
  const root = document.documentElement;
  root.style.setProperty('--theme-bg', t.bg);
  root.style.setProperty('--theme-surface', t.surface);
  root.style.setProperty('--theme-border', t.border);
  root.style.setProperty('--theme-accent', t.accent);
  root.style.setProperty('--theme-accent-fg', t.accentFg);
  root.style.setProperty('--theme-text', t.text);
  root.style.setProperty('--theme-text-muted', t.textMuted);
  root.style.setProperty('--theme-font-mono', t.fontMono);
  root.style.setProperty('--theme-font-sans', t.fontSans);
  root.style.setProperty('--theme-radius', t.radius);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      activeThemeId: DEFAULT_THEME_ID,
      theme: THEMES.find((t) => t.id === DEFAULT_THEME_ID)!,
      setTheme: (id: string) => {
        const theme = THEMES.find((t) => t.id === id) ?? THEMES[0];
        applyTheme(theme);
        set({ activeThemeId: id, theme });
      },
    }),
    { name: 'yfitops-theme' }
  )
);
