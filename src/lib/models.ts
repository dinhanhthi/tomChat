import { ClaudeIcon } from '../icons/service/ClaudeIcon'
import { DeepSeekIcon } from '../icons/service/DeepSeekIcon'
import { GeminiIcon } from '../icons/service/GeminiIcon'
import { MistralIcon } from '../icons/service/MistralIcon'
import { OpenAIIcon } from '../icons/service/OpenAIIcon'
import { XAIIcon } from '../icons/service/XAIIcon'

export type AIService =
  | 'amazon'
  | 'claude'
  | 'deepseek'
  | 'facebook'
  | 'gemini'
  | 'mistral'
  | 'nvidia'
  | 'openai'
  | 'xai'

export interface AIModel {
  id: string
  service: AIService
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  name: string
  shortName?: string
}

export const DEFAULT_MODEL_ID = 'gpt-4o-mini'

// https://platform.openai.com/docs/models
const openaiModels: AIModel[] = [
  {
    id: 'gpt-4o-mini',
    service: 'openai',
    icon: OpenAIIcon,
    name: 'GPT-4o mini',
    shortName: '4o Mini'
  },
  {
    id: 'gpt-4o',
    service: 'openai',
    icon: OpenAIIcon,
    name: 'GPT-4o',
    shortName: '4o'
  },
  {
    id: 'o1',
    service: 'openai',
    icon: OpenAIIcon,
    name: 'o1',
    shortName: 'o1'
  },
  {
    id: 'o1-mini',
    service: 'openai',
    icon: OpenAIIcon,
    name: 'o1 mini',
    shortName: 'o1 Mini'
  },
  {
    id: 'dall-e-3',
    service: 'openai',
    icon: OpenAIIcon,
    name: 'DALL-E 3',
    shortName: 'Dall-e 3'
  }
]

// https://ai.google.dev/gemini-api/docs/models/gemini
const geminiModels: AIModel[] = [
  {
    id: 'gemini-1.5-flash',
    service: 'gemini',
    icon: GeminiIcon,
    name: 'Gemini 1.5 Flash',
    shortName: '1.5 Flash'
  },
  {
    id: 'gemini-1.5-pro',
    service: 'gemini',
    icon: GeminiIcon,
    name: 'Gemini 1.5 Pro',
    shortName: '1.5 Pro'
  },
  {
    id: 'gemini-2.0-flash-exp',
    service: 'gemini',
    icon: GeminiIcon,
    name: 'Gemini 2.0 Flash',
    shortName: '2.0 Flash'
  }
]

// https://docs.anthropic.com/en/docs/about-claude/models
const claudeModels: AIModel[] = [
  {
    id: 'claude-3-5-haiku',
    service: 'claude',
    icon: ClaudeIcon,
    name: 'Claude 3.5 Haiku',
    shortName: '3.5 Haiku'
  },
  {
    id: 'claude-3-5-sonnet',
    service: 'claude',
    icon: ClaudeIcon,
    name: 'Claude 3.5 Sonnet',
    shortName: '3.5 Sonnet'
  }
]

// https://docs.mistral.ai/getting-started/models/models_overview/
const mistralModels: AIModel[] = [
  {
    id: 'mistral-small-latest',
    service: 'mistral',
    icon: MistralIcon,
    name: 'Mistral Small',
    shortName: 'M Small'
  },
  {
    id: 'mistral-large-latest',
    service: 'mistral',
    icon: MistralIcon,
    name: 'Mistral Large',
    shortName: 'M Large'
  }
]

// https://docs.x.ai/docs/overview
const xAIModels: AIModel[] = [
  {
    id: 'grok-2',
    service: 'xai',
    icon: XAIIcon,
    name: 'Grok 2'
  }
]

// https://api-docs.deepseek.com/quick_start/pricing
const deepseekModels: AIModel[] = [
  {
    id: 'deepseek-chat',
    service: 'deepseek',
    icon: DeepSeekIcon,
    name: 'DeepSeek V3',
    shortName: 'DS V3'
  },
  {
    id: 'deepseek-reasoner',
    service: 'deepseek',
    icon: DeepSeekIcon,
    name: 'DeepSeek R1',
    shortName: 'DS R1'
  }
]

export const allModels: AIModel[] = [
  ...deepseekModels,
  ...claudeModels,
  ...geminiModels,
  ...mistralModels,
  ...openaiModels,
  ...xAIModels
]

export const getModelById = (id: string): AIModel | undefined => {
  return allModels.find(model => model.id === id)
}
