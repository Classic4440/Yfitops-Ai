import type { ModelDefinition } from '@/types';

export const MODELS: ModelDefinition[] = [
  {
    id: 'gemini-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google AI Studio',
    tier: 'free',
    contextWindow: '1M tokens',
    rpm: 60,
    rpd: 1500,
    badge: 'FREE',
    color: '#4285F4',
    useCases: ['Simple completions', 'Quick edits', 'Short context tasks'],
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3',
    provider: 'DeepSeek API',
    tier: 'free',
    contextWindow: '64K tokens',
    badge: 'FREE',
    color: '#7C3AED',
    useCases: ['Code generation', 'Architectural planning', 'Complex reasoning'],
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI Agent',
    provider: 'Google (Apache 2.0)',
    tier: 'free',
    contextWindow: '1M tokens',
    rpm: 60,
    rpd: 1000,
    badge: 'FREE',
    color: '#34A853',
    useCases: ['Terminal operations', 'Long-context tasks', 'Full codebase ingestion'],
  },
  {
    id: 'qwen-coder',
    name: 'Qwen Coder',
    provider: 'Qwen API',
    tier: 'free',
    contextWindow: '128K tokens',
    badge: 'FREE',
    color: '#EA4335',
    useCases: ['Code completion', 'Multi-language support', 'Code review'],
  },
  {
    id: 'claude-sonnet',
    name: 'Claude Sonnet 4.5',
    provider: 'Anthropic',
    tier: 'user-key',
    contextWindow: '200K tokens',
    costPer1M: '$3.00',
    badge: 'USER KEY',
    color: '#D4A574',
    useCases: ['Complex reasoning', 'Architectural planning', 'Multi-file refactors'],
  },
  {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    tier: 'user-key',
    contextWindow: '128K tokens',
    costPer1M: '$1.25',
    badge: 'USER KEY',
    color: '#10A37F',
    useCases: ['All-around tasks', 'Fast completions', 'Code generation'],
  },
  {
    id: 'gemini-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google (User Key)',
    tier: 'user-key',
    contextWindow: '1M tokens',
    badge: 'USER KEY',
    color: '#FBBC04',
    useCases: ['Long-context analysis', '100K+ token tasks', 'Monorepo understanding'],
  },
];

export const FREE_MODELS = MODELS.filter((m) => m.tier === 'free');
export const USER_KEY_MODELS = MODELS.filter((m) => m.tier === 'user-key');

export function routeModel(
  promptType: string,
  hasUserKeys: boolean
): ModelDefinition {
  const router: Record<string, string> = {
    simple: 'gemini-flash',
    terminal: 'gemini-cli',
    refactor: hasUserKeys ? 'claude-sonnet' : 'deepseek-v3',
    architecture: hasUserKeys ? 'claude-sonnet' : 'deepseek-v3',
    review: 'qwen-coder',
    longcontext: hasUserKeys ? 'gemini-pro' : 'gemini-cli',
    default: 'gemini-flash',
  };
  const modelId = router[promptType] || router.default;
  return MODELS.find((m) => m.id === modelId) || MODELS[0];
}
