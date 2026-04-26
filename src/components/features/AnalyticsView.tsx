import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { useThemeStore } from '@/stores/themeStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { MessageSquare, Cpu, Database, BarChart2 } from 'lucide-react';

interface DailyVolume {
  date: string;
  messages: number;
}

interface ModelUsage {
  model: string;
  count: number;
}

interface Stats {
  totalMessages: number;
  totalTokens: number;
  activeWorkspaces: number;
}

function shortModel(id: string) {
  const map: Record<string, string> = {
    'google/gemini-3-flash-preview': 'Gemini 3 Flash',
    'google/gemini-2.5-flash-lite': 'Gemini 2.5 Lite',
    'openai/gpt-5-mini': 'GPT-5 Mini',
    'openai/gpt-5-nano': 'GPT-5 Nano',
  };
  return map[id] ?? id.split('/')[1] ?? id;
}

const PALETTE = ['#2563EB', '#7C3AED', '#10A37F', '#F59E0B', '#EF4444', '#EC4899'];

export const AnalyticsView: React.FC = () => {
  const { theme } = useThemeStore();
  const { workspaces } = useWorkspaceStore();
  const [daily, setDaily] = useState<DailyVolume[]>([]);
  const [modelUsage, setModelUsage] = useState<ModelUsage[]>([]);
  const [stats, setStats] = useState<Stats>({ totalMessages: 0, totalTokens: 0, activeWorkspaces: 0 });
  const [loading, setLoading] = useState(true);

  const { bg, surface, border, accent, text, textMuted, radius } = theme;

  useEffect(() => {
    async function load() {
      setLoading(true);

      // Fetch all agent messages for the current user
      const { data: msgs, error } = await supabase
        .from('agent_messages')
        .select('created_at, model_id, tokens, role')
        .order('created_at', { ascending: true })
        .limit(2000);

      if (error || !msgs) {
        setLoading(false);
        return;
      }

      // --- Daily volume (last 14 days) ---
      const now = new Date();
      const dailyMap: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        dailyMap[key] = 0;
      }
      for (const m of msgs) {
        const key = m.created_at.slice(0, 10);
        if (key in dailyMap) dailyMap[key]++;
      }
      setDaily(
        Object.entries(dailyMap).map(([date, messages]) => ({
          date: date.slice(5), // MM-DD
          messages,
        }))
      );

      // --- Model usage (only assistant messages with model_id) ---
      const modelMap: Record<string, number> = {};
      for (const m of msgs) {
        if (m.role === 'assistant' && m.model_id) {
          modelMap[m.model_id] = (modelMap[m.model_id] ?? 0) + 1;
        }
      }
      setModelUsage(
        Object.entries(modelMap)
          .sort((a, b) => b[1] - a[1])
          .map(([model, count]) => ({ model: shortModel(model), count }))
      );

      // --- Stats ---
      const totalMessages = msgs.length;
      const totalTokens = msgs.reduce((s, m) => s + (m.tokens ?? 0), 0);
      const activeWorkspaces = workspaces.length;
      setStats({ totalMessages, totalTokens, activeWorkspaces });

      setLoading(false);
    }

    load();
  }, [workspaces.length]);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string | number;
    sub?: string;
  }> = ({ icon, label, value, sub }) => (
    <div
      className="rounded-xl p-4 flex items-center gap-4"
      style={{ background: surface, border: `1px solid ${border}`, borderRadius: radius }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: accent + '18', color: accent }}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs" style={{ color: textMuted }}>{label}</div>
        <div className="text-xl font-bold mt-0.5" style={{ color: text }}>{value}</div>
        {sub && <div className="text-xs mt-0.5" style={{ color: textMuted }}>{sub}</div>}
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean; payload?: { value: number }[]; label?: string
  }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className="px-3 py-2 rounded text-xs"
        style={{ background: surface, border: `1px solid ${border}`, color: text, borderRadius: radius }}
      >
        <div style={{ color: textMuted }}>{label}</div>
        <div className="font-bold mt-0.5" style={{ color: accent }}>{payload[0].value} messages</div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6" style={{ background: bg }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold" style={{ color: text }}>Analytics</h2>
          <p className="text-xs mt-0.5" style={{ color: textMuted }}>
            Real-time usage data from your OnSpace backend
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48" style={{ color: textMuted }}>
            <BarChart2 size={24} className="animate-pulse" />
            <span className="ml-2 text-sm">Loading analytics…</span>
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard
                icon={<MessageSquare size={18} />}
                label="Total Messages"
                value={stats.totalMessages.toLocaleString()}
                sub="all time"
              />
              <StatCard
                icon={<Cpu size={18} />}
                label="Tokens Used"
                value={stats.totalTokens > 0 ? stats.totalTokens.toLocaleString() : '—'}
                sub="across all models"
              />
              <StatCard
                icon={<Database size={18} />}
                label="Active Workspaces"
                value={stats.activeWorkspaces}
                sub="connected repos"
              />
            </div>

            {/* Daily volume chart */}
            <div
              className="rounded-xl p-5 mb-6"
              style={{ background: surface, border: `1px solid ${border}`, borderRadius: radius }}
            >
              <h3 className="text-sm font-semibold mb-4" style={{ color: text }}>
                Daily Message Volume — Last 14 Days
              </h3>
              {daily.every((d) => d.messages === 0) ? (
                <div className="text-center py-10 text-xs" style={{ color: textMuted }}>
                  No messages yet. Start chatting with the agent to see data here.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={daily} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="date"
                      tick={{ fill: textMuted, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: textMuted, fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="messages" fill={accent} radius={[3, 3, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Model usage pie */}
            <div
              className="rounded-xl p-5"
              style={{ background: surface, border: `1px solid ${border}`, borderRadius: radius }}
            >
              <h3 className="text-sm font-semibold mb-4" style={{ color: text }}>
                Model Usage Distribution
              </h3>
              {modelUsage.length === 0 ? (
                <div className="text-center py-10 text-xs" style={{ color: textMuted }}>
                  No model usage data yet. The chart will populate as you use the agent.
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={modelUsage}
                        dataKey="count"
                        nameKey="model"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={44}
                        paddingAngle={2}
                      >
                        {modelUsage.map((_, i) => (
                          <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                        ))}
                      </Pie>
                      <Legend
                        formatter={(value) => (
                          <span style={{ color: textMuted, fontSize: 11 }}>{value}</span>
                        )}
                      />
                      <Tooltip
                        formatter={(value) => [`${value} responses`, 'Count']}
                        contentStyle={{
                          background: surface,
                          border: `1px solid ${border}`,
                          borderRadius: radius,
                          color: text,
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Breakdown list */}
                  <div className="w-full sm:w-48 space-y-2">
                    {modelUsage.map((m, i) => (
                      <div key={m.model} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: PALETTE[i % PALETTE.length] }}
                          />
                          <span className="text-xs truncate" style={{ color: textMuted }}>{m.model}</span>
                        </div>
                        <span className="text-xs font-semibold flex-shrink-0" style={{ color: text }}>
                          {m.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
