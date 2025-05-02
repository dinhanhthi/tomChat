import { ClaudeColorIcon, ClaudeIcon } from '../icons/service/ClaudeIcon'
import { DeepSeekColorIcon, DeepSeekIcon } from '../icons/service/DeepSeekIcon'
import { GeminiColorIcon, GeminiIcon } from '../icons/service/GeminiIcon'
import { MistralColorIcon, MistralIcon } from '../icons/service/MistralIcon'
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
  name: string
  shortName?: string
}

export interface AIServiceInfo {
  key: AIService
  name: string
  apiDocUrl?: string
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  colorIcon: React.FC<React.SVGProps<SVGSVGElement>>
  serviceColor: string
  models?: AIModel[]
}

export const DEFAULT_MODEL_ID = 'gpt-4o-mini'

export const supportedAIServices: AIServiceInfo[] = [
  {
    key: 'openai',
    name: 'OpenAI',
    apiDocUrl: 'https://platform.openai.com/docs/api-reference/introduction',
    icon: OpenAIIcon,
    colorIcon: OpenAIIcon,
    serviceColor: '#444',
    models: [
      {
        id: 'chatgpt-4o-latest',
        name: 'ChatGPT-4o',
        shortName: 'ChatGPT'
      },
      {
        id: 'gpt-4.5',
        name: 'GPT-4.5',
        shortName: 'GPT-4.5'
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o mini',
        shortName: '4o Mini'
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        shortName: '4o'
      },
      {
        id: 'gpt-4.1',
        name: 'GPT-4.1',
        shortName: '4.1'
      },
      {
        id: 'gpt-4.1-mini',
        name: 'GPT-4.1 mini',
        shortName: '4.1 Mini'
      },
      {
        id: 'o4-mini',
        name: 'o4 mini',
        shortName: 'o4 Mini'
      },
      {
        id: 'o3',
        name: 'o3',
        shortName: 'o3'
      },
      {
        id: 'o3-mini',
        name: 'o3 mini',
        shortName: 'o3 Mini'
      }
    ]
  },
  {
    key: 'claude',
    name: 'Anthropic Claude',
    apiDocUrl: 'https://docs.anthropic.com/',
    icon: ClaudeIcon,
    colorIcon: ClaudeColorIcon,
    serviceColor: '#cf4c15',
    models: [
      {
        id: 'claude-3-7-sonnet',
        name: 'Claude 3.7 Sonnet',
        shortName: '3.7 Sonnet'
      },
      {
        id: 'claude-3-5-haiku',
        name: 'Claude 3.5 Haiku',
        shortName: '3.5 Haiku'
      }
    ]
  },
  {
    key: 'gemini',
    name: 'Google Gemini',
    apiDocUrl: 'https://ai.google.dev/gemini-api/docs',
    icon: GeminiIcon,
    colorIcon: GeminiColorIcon,
    serviceColor: '#3c59cf',
    models: [
      {
        id: 'gemini-2.5-pro-preview-03-25',
        name: 'Gemini 2.5 Pro Preview',
        shortName: '2.5 Pro'
      },
      {
        id: 'gemini-2.5-flash-preview-04-17',
        name: 'Gemini 2.5 Flash Preview',
        shortName: '2.5 Flash'
      },
      {
        id: 'gemini-2.0-pro',
        name: 'Gemini 2.0 Pro',
        shortName: '2.0 Pro'
      },
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        shortName: '2.0 Flash'
      }
    ]
  },
  {
    key: 'mistral',
    name: 'Mistral AI',
    apiDocUrl: 'https://docs.mistral.ai/api/',
    icon: MistralIcon,
    colorIcon: MistralColorIcon,
    serviceColor: '#b71e13',
    models: [
      {
        id: 'mistral-large-latest',
        name: 'Mistral Large',
        shortName: 'Large'
      },
      {
        id: 'mistral-small-latest',
        name: 'Mistral Small',
        shortName: 'Small'
      },
      {
        id: 'codestral-latest',
        name: 'Codestral',
        shortName: 'Codestral'
      }
    ]
  },
  {
    key: 'xai',
    name: 'xAI (Grok)',
    apiDocUrl: 'https://docs.x.ai/docs/overview',
    icon: XAIIcon,
    colorIcon: XAIIcon,
    serviceColor: '#444',
    models: [
      {
        id: 'grok-3',
        name: 'Grok 3',
        shortName: 'Grok 3'
      },
      {
        id: 'grok-3-mini',
        name: 'Grok 3 Mini',
        shortName: 'Grok 3 Mini'
      }
    ]
  },
  {
    key: 'deepseek',
    name: 'DeepSeek',
    apiDocUrl: 'https://api-docs.deepseek.com/',
    icon: DeepSeekIcon,
    colorIcon: DeepSeekColorIcon,
    serviceColor: '#4D6BFE',
    models: [
      {
        id: 'deepseek-reasoner',
        name: 'DeepSeek Reasoner',
        shortName: 'DS Reasoner'
      },
      {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        shortName: 'DS Chat'
      }
    ]
  }
]

export const getServiceInfo = (key: AIService): AIServiceInfo | undefined => {
  return supportedAIServices.find(service => service.key === key)
}

export const getServiceInfoFromModelId = (modelId: string): AIServiceInfo | undefined => {
  for (const service of supportedAIServices) {
    if (service.models?.some(model => model.id === modelId)) {
      return service
    }
  }
  return undefined
}

export interface FullAIModel extends AIModel {
  service: AIService
  icon: React.FC<React.SVGProps<SVGSVGElement>>
  colorIcon: React.FC<React.SVGProps<SVGSVGElement>>
  serviceColor: string
}

export const getFullModelInfo = (model: AIModel, service: AIServiceInfo): FullAIModel => {
  return {
    ...model,
    service: service.key,
    icon: service.icon,
    colorIcon: service.colorIcon,
    serviceColor: service.serviceColor
  }
}

export const allModels: FullAIModel[] = supportedAIServices.flatMap(service =>
  (service.models || []).map(model => getFullModelInfo(model, service))
)

export const getModelById = (id: string): FullAIModel | undefined => {
  const model = allModels.find(model => model.id === id)
  return model
}
