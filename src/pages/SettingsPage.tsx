import React, { useState } from 'react';
import { useThemeStore } from '@/stores/themeStore';
import { THEMES } from '@/constants/themes';
import { AVAILABLE_MODELS } from '@/stores/agentStore';
import { useAgentStore } from '@/stores/agentStore';
import { useUIStore, type LayoutMode, type DensityMode } from '@/stores/uiStore';
import {
  Check, Palette, Cpu, Trash2, Database, Layout, AlignJustify,
  Monitor, Columns2, Focus, Minimize2,
} from 'lucide-react';

const LAYOUT_OPTIONS: { id: LayoutMode; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: 'default', label: 'Default', desc: 'Nav bar + full panel', icon: <Monitor size={14} /> },
  { id: 'split', label: 'Split', desc: 'Chat left, Editor right', icon: <Columns2 size={14} /> },
  { id: 'focus', label: 'Focus', desc: 'Single panel, no chrome', icon: <Focus size={14} /> },
  { id: 'minimal', label: 'Minimal', desc: 'Compact, icon-only nav', icon: <Minimize2 size={14} /> },
];

const DENSITY_OPTIONS: { id: DensityMode; label: string; desc: string }[] = [
  { id: 'comfortable', label: 'Comfortable', desc: 'More spacing, easier to scan' },
  { id: 'compact', label: 'Compact', desc: 'Tighter layout, more content' },
];

export const SettingsPage: React.FC = () => {
  const { activeThemeId, theme, setTheme } = useThemeStore();
  const { selectedModel, setModel, clearMessages } = useAgentStore();
  const { layoutMode, density, setLayoutMode, setDensity } = useUIStore();
  const [cleared, setCleared] = useState(false);

  const { bg, surface, border, accent, accentFg, text, textMuted, radius } = theme;

  const handleClear = () => {
    clearMessages();
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  };

  const Section: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode }> = ({
    icon, title, subtitle, children,
  }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color: accent }}>{icon}</span>
        <h3 className="text-sm font-bold" style={{ color: text }}>{title}</h3>
      </div>
      {subtitle && <p className="text-xs mb-3 ml-6" style={{ color: textMuted }}>{subtitle}</p>}
      <div
        className="rounded-xl p-4 space-y-3"
        style={{ background: surface, border: `1px solid ${border}`, borderRadius: radius }}
      >
        {children}
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6" style={{ background: bg }}>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-black mb-1" style={{ color: text }}>Settings</h2>
        <p className="text-sm mb-8" style={{ color: textMuted }}>Customize your YfitOps workspace</p>

        {/* ── Theme ── */}
        <Section icon={<Palette size={16} />} title="Appearance — Themes" subtitle="Choose from 12 brand-inspired color systems">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {THEMES.map((t) => {
              const isActive = activeThemeId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className="relative p-3 rounded-lg text-left transition-all hover:opacity-90"
                  style={{
                    background: t.bg,
                    border: `2px solid ${isActive ? t.accent : t.border}`,
                    borderRadius: radius,
                  }}
                >
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.accent }} />
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: t.surface }} />
                  </div>
                  <div className="text-xs font-medium truncate" style={{ color: t.text }}>{t.label}</div>
                  {isActive && (
                    <div className="absolute top-2 right-2">
                      <Check size={10} style={{ color: t.accent }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Layout ── */}
        <Section
          icon={<Layout size={16} />}
          title="Layout Mode"
          subtitle="Controls the overall panel structure of the workspace"
        >
          <div className="grid grid-cols-2 gap-2">
            {LAYOUT_OPTIONS.map((opt) => {
              const isActive = layoutMode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setLayoutMode(opt.id)}
                  className="flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-all hover:opacity-90"
                  style={{
                    background: isActive ? accent + '15' : bg,
                    border: `1px solid ${isActive ? accent : border}`,
                    borderRadius: radius,
                    color: isActive ? accent : text,
                  }}
                >
                  <span className="mt-0.5 flex-shrink-0" style={{ color: isActive ? accent : textMuted }}>
                    {opt.icon}
                  </span>
                  <div>
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: textMuted }}>{opt.desc}</div>
                  </div>
                  {isActive && <Check size={12} className="ml-auto flex-shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Density ── */}
        <Section
          icon={<AlignJustify size={16} />}
          title="UI Density"
          subtitle="Controls spacing throughout the interface"
        >
          <div className="grid grid-cols-2 gap-2">
            {DENSITY_OPTIONS.map((opt) => {
              const isActive = density === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setDensity(opt.id)}
                  className="flex items-start justify-between gap-2 px-3 py-3 rounded-lg text-left transition-all hover:opacity-90"
                  style={{
                    background: isActive ? accent + '15' : bg,
                    border: `1px solid ${isActive ? accent : border}`,
                    borderRadius: radius,
                    color: isActive ? accent : text,
                  }}
                >
                  <div>
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: textMuted }}>{opt.desc}</div>
                  </div>
                  {isActive && <Check size={12} className="flex-shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── AI Model ── */}
        <Section icon={<Cpu size={16} />} title="AI Model" subtitle="Default model used by the agent (can also change per-chat)">
          <div className="space-y-2">
            {AVAILABLE_MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-opacity hover:opacity-80"
                style={{
                  background: m.id === selectedModel ? accent + '15' : bg,
                  border: `1px solid ${m.id === selectedModel ? accent : border}`,
                  color: m.id === selectedModel ? accent : text,
                  borderRadius: radius,
                }}
              >
                <span className="font-medium">{m.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: textMuted }}>{m.id.split('/')[0]}</span>
                  {m.id === selectedModel && <Check size={12} />}
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* ── Data ── */}
        <Section icon={<Database size={16} />} title="Data">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium" style={{ color: text }}>Clear chat history</div>
              <div className="text-xs mt-0.5" style={{ color: textMuted }}>Removes all messages from local state (not from database)</div>
            </div>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-all hover:opacity-80 flex-shrink-0 ml-4"
              style={{
                background: cleared ? '#10A37F22' : '#FF6B6B22',
                color: cleared ? '#10A37F' : '#FF6B6B',
                border: `1px solid ${cleared ? '#10A37F44' : '#FF6B6B44'}`,
                borderRadius: radius,
              }}
            >
              {cleared ? <><Check size={12} /> Cleared</> : <><Trash2 size={12} /> Clear</>}
            </button>
          </div>
        </Section>

        {/* Footer */}
        <div className="text-center mt-8 pb-8" style={{ color: textMuted }}>
          <div className="text-lg font-black mb-1" style={{ color: accent }}>YfitOps</div>
          <div className="text-xs">Free · Open-source · Multi-model · Multi-theme</div>
          <div className="text-xs mt-1">Powered by OnSpace AI · Supabase · React</div>
          <div className="text-xs mt-3 opacity-50">
            Layout: <strong>{layoutMode}</strong> · Density: <strong>{density}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
