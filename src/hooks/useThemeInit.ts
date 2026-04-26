import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { THEMES } from '@/constants/themes';

export function useThemeInit() {
  const { activeThemeId, setTheme } = useThemeStore();

  useEffect(() => {
    const theme = THEMES.find((t) => t.id === activeThemeId);
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--theme-bg', theme.bg);
      root.style.setProperty('--theme-surface', theme.surface);
      root.style.setProperty('--theme-border', theme.border);
      root.style.setProperty('--theme-accent', theme.accent);
      root.style.setProperty('--theme-accent-fg', theme.accentFg);
      root.style.setProperty('--theme-text', theme.text);
      root.style.setProperty('--theme-text-muted', theme.textMuted);
      root.style.setProperty('--theme-font-mono', theme.fontMono);
      root.style.setProperty('--theme-font-sans', theme.fontSans);
      root.style.setProperty('--theme-radius', theme.radius);
    }
  }, [activeThemeId]);
}
