import React from 'react';
import { Zap, GitBranch, Cpu, Layers, Shield, ArrowRight, Check, Star, Code2, Globe } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import heroImg from '@/assets/hero.jpg';

const FEATURE_HIGHLIGHTS = [
  { icon: Cpu, title: '30 Absorbed Features', desc: 'Best of Claude Code, Cursor, Devin, v0, Windsurf, Replit + 15 more' },
  { icon: Layers, title: '7 Complete Themes', desc: 'Cursor Dark, Claude Warm, Antigravity, Windsurf, v0, Replit, Devin' },
  { icon: Zap, title: 'Default Free Models', desc: 'Gemini Flash, DeepSeek V3, Gemini CLI, Qwen Coder — no card required' },
  { icon: GitBranch, title: 'GitHub Native', desc: 'Every AI action = real git commit. Parallel agents on isolated worktrees.' },
  { icon: Shield, title: 'Open Source', desc: 'Apache 2.0 — audit the code, self-host, fork, contribute' },
  { icon: Globe, title: '650+ MCP Servers', desc: 'Connect to the full MCP ecosystem for tools, search, and integrations' },
];

const FREE_MODELS = [
  { name: 'Gemini 2.5 Flash', detail: '1,500 req/day · 1M context', color: '#4285F4' },
  { name: 'DeepSeek V3', detail: 'Generous free tier · Complex reasoning', color: '#7C3AED' },
  { name: 'Gemini CLI Agent', detail: '1,000 req/day · 60 req/min', color: '#34A853' },
  { name: 'Qwen Coder', detail: '128K context · Multi-language', color: '#EA4335' },
];

export const LandingPage: React.FC = () => {
  const { setShowLanding } = useUIStore();

  return (
    <div className="min-h-screen overflow-y-auto custom-scrollbar" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
            style={{ background: 'var(--theme-accent)', color: 'var(--theme-accent-fg)' }}>
            Y
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ fontFamily: 'var(--theme-font-mono)', color: 'var(--theme-text)' }}>
            YfitOps
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded ml-1" style={{ background: '#22C55E22', color: '#22C55E' }}>
            OPEN SOURCE
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 text-sm" style={{ color: 'var(--theme-text-muted)' }}>
            <a href="#features" className="hover:opacity-80 transition-all">Features</a>
            <a href="#models" className="hover:opacity-80 transition-all">Models</a>
            <a href="https://github.com" className="hover:opacity-80 transition-all">GitHub</a>
          </div>
          <button
            onClick={() => setShowLanding(false)}
            className="flex items-center gap-1.5 px-4 py-2 rounded text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: 'var(--theme-accent)', color: 'var(--theme-accent-fg)', borderRadius: 'var(--theme-radius)' }}
          >
            Open Workspace <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          background: `radial-gradient(ellipse at 20% 50%, var(--theme-accent) 0%, transparent 60%)`
        }} />
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-medium"
              style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-muted)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22C55E' }} />
              Free · Open Source · No credit card required
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight"
              style={{ color: 'var(--theme-text)', fontFamily: 'var(--theme-font-sans)' }}>
              The AI Engineering
              <br />
              <span style={{ color: 'var(--theme-accent)' }}>Super-Agent</span>
              <br />
              Platform
            </h1>

            <p className="text-lg mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--theme-text-muted)', fontFamily: 'var(--theme-font-sans)' }}>
              Absorbs the best features from <strong style={{ color: 'var(--theme-text)' }}>20+ leading AI coding platforms</strong> into one unified, open-source workspace. Multi-model, multi-theme, GitHub-native.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowLanding(false)}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded text-base font-bold transition-all hover:opacity-80"
                style={{ background: 'var(--theme-accent)', color: 'var(--theme-accent-fg)', borderRadius: 'var(--theme-radius)' }}
              >
                <Zap size={18} />
                Launch Workspace — Free
              </button>
              <a href="https://github.com" className="flex items-center justify-center gap-2 px-8 py-3.5 rounded text-base font-semibold transition-all hover:opacity-70"
                style={{ border: '1px solid var(--theme-border)', color: 'var(--theme-text)', borderRadius: 'var(--theme-radius)' }}>
                <Code2 size={16} />
                View on GitHub
              </a>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-xs" style={{ color: 'var(--theme-text-muted)' }}>
              {['$0 to start', '30 absorbed features', '7 themes', '650+ MCP servers'].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check size={11} style={{ color: '#22C55E' }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl border"
            style={{ borderColor: 'var(--theme-border)', borderRadius: '12px' }}>
            <img src={heroImg} alt="YfitOps workspace" className="w-full object-cover" style={{ maxHeight: '480px' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--theme-bg) 0%, transparent 40%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
              <div className="flex items-center gap-3">
                {['running', 'planning', 'running', 'done'].map((status, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded text-xs"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                    <div className={`w-1.5 h-1.5 rounded-full ${status !== 'done' ? 'animate-pulse' : ''}`}
                      style={{ background: status === 'running' ? '#22C55E' : status === 'planning' ? '#F97316' : '#4285F4' }} />
                    Agent {i + 1} · {status}
                  </div>
                ))}
              </div>
              <div className="text-xs px-2 py-1 rounded"
                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', color: '#22C55E' }}>
                4 agents active · $0.00 cost
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Models */}
      <section id="models" className="py-16 border-t" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--theme-text)', fontFamily: 'var(--theme-font-sans)' }}>
              Default Free Models
            </h2>
            <p className="text-base" style={{ color: 'var(--theme-text-muted)' }}>
              Four powerful models pre-configured at zero cost. No API key, no credit card.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {FREE_MODELS.map((m) => (
              <div key={m.name} className="p-5 rounded border"
                style={{ background: 'var(--theme-surface)', borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius)' }}>
                <div className="w-8 h-8 rounded-full mb-3" style={{ background: `${m.color}22`, border: `1px solid ${m.color}44` }}>
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full" style={{ background: m.color }} />
                  </div>
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--theme-text)' }}>{m.name}</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--theme-text-muted)' }}>{m.detail}</p>
                <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: '#22C55E22', color: '#22C55E' }}>FREE</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 border-t" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--theme-text)', fontFamily: 'var(--theme-font-sans)' }}>
              30 Absorbed Features
            </h2>
            <p className="text-base" style={{ color: 'var(--theme-text-muted)' }}>
              The definitive feature set from the best AI coding tools ever built
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {FEATURE_HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded border flex gap-4 items-start"
                style={{ background: 'var(--theme-surface)', borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius)' }}>
                <div className="w-10 h-10 rounded flex items-center justify-center shrink-0"
                  style={{ background: 'var(--theme-accent)' + '22' }}>
                  <Icon size={18} style={{ color: 'var(--theme-accent)' }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--theme-text)' }}>{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t text-center" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-black mb-4" style={{ color: 'var(--theme-text)', fontFamily: 'var(--theme-font-sans)' }}>
            Build with AI at <span style={{ color: 'var(--theme-accent)' }}>$0</span>
          </h2>
          <p className="text-base mb-8" style={{ color: 'var(--theme-text-muted)' }}>
            The most complete free AI engineering workstation ever assembled.
          </p>
          <button
            onClick={() => setShowLanding(false)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded text-base font-bold transition-all hover:opacity-80"
            style={{ background: 'var(--theme-accent)', color: 'var(--theme-accent-fg)', borderRadius: 'var(--theme-radius)' }}
          >
            <Zap size={18} />
            Open YfitOps — It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t px-6 text-center" style={{ borderColor: 'var(--theme-border)' }}>
        <p className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
          YfitOps · Apache 2.0 · Open Source · Built for developers, by developers
        </p>
      </footer>
    </div>
  );
};
