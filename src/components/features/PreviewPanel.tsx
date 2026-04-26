import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink, Wifi, WifiOff, Maximize2 } from 'lucide-react';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DEVICE_CONFIG: Record<DeviceMode, { width: string; label: string; icon: React.ReactNode }> = {
  desktop: { width: '100%', label: 'Desktop', icon: <Monitor size={13} /> },
  tablet: { width: '768px', label: 'Tablet', icon: <Tablet size={13} /> },
  mobile: { width: '375px', label: 'Mobile', icon: <Smartphone size={13} /> },
};

export const PreviewPanel: React.FC = () => {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [online, setOnline] = useState(true);

  const previewUrl = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800&fit=crop';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Preview Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b shrink-0" style={{ borderColor: 'var(--theme-border)' }}>
        {/* Device toggles */}
        <div className="flex items-center gap-0.5 p-0.5 rounded" style={{ background: 'var(--theme-bg)', border: '1px solid var(--theme-border)', borderRadius: 'var(--theme-radius)' }}>
          {(Object.keys(DEVICE_CONFIG) as DeviceMode[]).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
              style={{
                background: device === d ? 'var(--theme-accent)' : 'transparent',
                color: device === d ? 'var(--theme-accent-fg)' : 'var(--theme-text-muted)',
                borderRadius: 'calc(var(--theme-radius) - 2px)',
              }}
            >
              {DEVICE_CONFIG[d].icon}
              <span className="hidden sm:inline">{DEVICE_CONFIG[d].label}</span>
            </button>
          ))}
        </div>

        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 px-2.5 py-1 rounded text-xs"
          style={{ background: 'var(--theme-bg)', border: '1px solid var(--theme-border)', borderRadius: 'var(--theme-radius)', color: 'var(--theme-text-muted)', fontFamily: 'var(--theme-font-mono)' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#22C55E' }} />
          localhost:5173
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setOnline(!online)}
            className="p-1.5 rounded transition-all hover:opacity-70"
            style={{ color: online ? '#22C55E' : '#EF4444' }}>
            {online ? <Wifi size={13} /> : <WifiOff size={13} />}
          </button>
          <button className="p-1.5 rounded transition-all hover:opacity-70" style={{ color: 'var(--theme-text-muted)' }}>
            <RefreshCw size={13} />
          </button>
          <button className="p-1.5 rounded transition-all hover:opacity-70" style={{ color: 'var(--theme-text-muted)' }}>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-4 custom-scrollbar"
        style={{ background: 'var(--theme-bg)' }}>
        <div
          className="transition-all duration-300 overflow-hidden rounded shadow-2xl w-full"
          style={{
            maxWidth: DEVICE_CONFIG[device].width,
            borderRadius: 'var(--theme-radius)',
            border: '1px solid var(--theme-border)',
            minHeight: '400px',
            background: 'var(--theme-surface)',
          }}
        >
          {/* Simulated browser chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b" style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-surface)' }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#EF4444' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FBBC04' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#22C55E' }} />
            <div className="flex-1 mx-3 px-2 py-0.5 rounded text-xs text-center"
              style={{ background: 'var(--theme-bg)', color: 'var(--theme-text-muted)', fontFamily: 'var(--theme-font-mono)' }}>
              localhost:5173
            </div>
          </div>

          {/* Preview content - shows a representative dashboard mockup */}
          <div className="p-6" style={{ minHeight: '360px', background: 'var(--theme-bg)' }}>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {['Agents Running', 'Commits Today', 'Cost Today'].map((label, i) => (
                <div key={label} className="p-3 rounded border text-center"
                  style={{ background: 'var(--theme-surface)', borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius)' }}>
                  <div className="text-xl font-bold mb-1" style={{ color: 'var(--theme-text)', fontFamily: 'var(--theme-font-mono)' }}>
                    {['4', '116', '$0.39'][i]}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>{label}</div>
                </div>
              ))}
            </div>
            <div className="h-32 rounded border flex items-center justify-center"
              style={{ background: 'var(--theme-surface)', borderColor: 'var(--theme-border)', borderRadius: 'var(--theme-radius)' }}>
              <div className="flex gap-1 items-end h-20 px-4">
                {[40, 65, 35, 80, 90, 55, 30].map((h, i) => (
                  <div key={i} className="w-6 rounded-sm transition-all"
                    style={{ height: `${h}%`, background: 'var(--theme-accent)', opacity: 0.7 + (i * 0.04) }} />
                ))}
              </div>
            </div>
            <div className="mt-3 text-xs text-center" style={{ color: 'var(--theme-text-muted)' }}>
              Live preview rendering · WebContainers active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
