// Task Taxonomy for AI-Human Collaboration Tracking
// Maps LLMs to specific task categories for quantifiable patterns

export type AITask =
  | 'code-generation'      // Writing code from specifications
  | 'code-review'          // Reviewing/debugging existing code
  | 'data-processing'      // Cleaning, transforming, parsing data
  | 'literature-review'    // Summarizing papers, finding relevant work
  | 'writing-drafting'     // First drafts of prose, documentation
  | 'writing-editing'      // Refining, improving existing text
  | 'brainstorming'        // Ideation, exploring solution spaces
  | 'data-analysis'        // Statistical analysis, visualization
  | 'survey-design'        // Crafting questions, survey logic
  | 'translation'          // Multi-language support
  | 'simulation'           // Running agent-based/synthetic experiments
  | 'ux-design';           // UI/UX suggestions, prototyping

export type LLMModel =
  | 'gpt-4'
  | 'gpt-4o'
  | 'gpt-3.5'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'claude-2'
  | 'gemini'
  | 'llama'
  | 'mistral'
  | 'cohere'
  | 'custom';

export interface TaskUsage {
  model: LLMModel;
  tasks: AITask[];
}

// Metadata for display
export const AI_TASK_METADATA: Record<AITask, { label: string; description: string; icon: string }> = {
  'code-generation': {
    label: 'Code Gen',
    description: 'Writing code from specifications',
    icon: '💻'
  },
  'code-review': {
    label: 'Code Review',
    description: 'Reviewing/debugging existing code',
    icon: '🔍'
  },
  'data-processing': {
    label: 'Data Proc',
    description: 'Cleaning, transforming, parsing data',
    icon: '⚙️'
  },
  'literature-review': {
    label: 'Lit Review',
    description: 'Summarizing papers, finding relevant work',
    icon: '📚'
  },
  'writing-drafting': {
    label: 'Drafting',
    description: 'First drafts of prose, documentation',
    icon: '✍️'
  },
  'writing-editing': {
    label: 'Editing',
    description: 'Refining, improving existing text',
    icon: '📝'
  },
  'brainstorming': {
    label: 'Ideation',
    description: 'Ideation, exploring solution spaces',
    icon: '💡'
  },
  'data-analysis': {
    label: 'Analysis',
    description: 'Statistical analysis, visualization',
    icon: '📊'
  },
  'survey-design': {
    label: 'Survey',
    description: 'Crafting questions, survey logic',
    icon: '📋'
  },
  'translation': {
    label: 'Translation',
    description: 'Multi-language support',
    icon: '🌐'
  },
  'simulation': {
    label: 'Simulation',
    description: 'Running agent-based/synthetic experiments',
    icon: '🎮'
  },
  'ux-design': {
    label: 'UX Design',
    description: 'UI/UX suggestions, prototyping',
    icon: '🎨'
  }
};

export const LLM_MODEL_METADATA: Record<LLMModel, { label: string; color: string }> = {
  'gpt-4': { label: 'GPT-4', color: 'hsl(142 70% 45%)' },
  'gpt-4o': { label: 'GPT-4o', color: 'hsl(142 70% 55%)' },
  'gpt-3.5': { label: 'GPT-3.5', color: 'hsl(142 50% 65%)' },
  'claude-3-opus': { label: 'Claude 3 Opus', color: 'hsl(25 95% 50%)' },
  'claude-3-sonnet': { label: 'Claude 3 Sonnet', color: 'hsl(25 85% 60%)' },
  'claude-3-haiku': { label: 'Claude 3 Haiku', color: 'hsl(25 75% 70%)' },
  'claude-2': { label: 'Claude 2', color: 'hsl(25 65% 55%)' },
  'gemini': { label: 'Gemini', color: 'hsl(210 90% 55%)' },
  'llama': { label: 'LLaMA', color: 'hsl(280 70% 55%)' },
  'mistral': { label: 'Mistral', color: 'hsl(200 80% 50%)' },
  'cohere': { label: 'Cohere', color: 'hsl(340 75% 55%)' },
  'custom': { label: 'Custom/Fine-tuned', color: 'hsl(0 0% 50%)' }
};

// All tasks as an ordered array for matrix rendering
export const ALL_TASKS: AITask[] = [
  'code-generation',
  'code-review',
  'data-processing',
  'literature-review',
  'writing-drafting',
  'writing-editing',
  'brainstorming',
  'data-analysis',
  'survey-design',
  'translation',
  'simulation',
  'ux-design'
];

// All models as an ordered array for matrix rendering
export const ALL_MODELS: LLMModel[] = [
  'gpt-4',
  'gpt-4o',
  'gpt-3.5',
  'claude-3-opus',
  'claude-3-sonnet',
  'claude-3-haiku',
  'claude-2',
  'gemini',
  'llama',
  'mistral',
  'cohere',
  'custom'
];
