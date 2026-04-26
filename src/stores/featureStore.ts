import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Feature } from '@/types';
import { FEATURES } from '@/constants/features';

interface FeatureStore {
  features: Feature[];
  toggleFeature: (id: string) => void;
  isEnabled: (id: string) => boolean;
  enabledCount: () => number;
}

export const useFeatureStore = create<FeatureStore>()(
  persist(
    (set, get) => ({
      features: FEATURES,

      toggleFeature: (id: string) => {
        set((s) => ({
          features: s.features.map((f) =>
            f.id === id ? { ...f, enabled: !f.enabled } : f
          ),
        }));
      },

      isEnabled: (id: string) => {
        return get().features.find((f) => f.id === id)?.enabled ?? false;
      },

      enabledCount: () => {
        return get().features.filter((f) => f.enabled).length;
      },
    }),
    { name: 'yfitops-features' }
  )
);
