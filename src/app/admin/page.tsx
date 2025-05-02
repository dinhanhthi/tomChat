'use client'

import { useAlertDialog } from '@/components/dialog-confirm'
import { ModelSelector } from '@/components/model-selector'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { db } from '@/db/database'
import { AIService, DEFAULT_MODEL_ID, getServiceInfoFromModelId, supportedAIServices } from '@/lib/models'
import { zodResolver } from '@hookform/resolvers/zod'
import { Download, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { xtoast } from '../../lib/xtoast'

// API Key Form Schema
const ApiKeyFormSchema = z.object({
  service: z.string(),
  apiKey: z.string().min(1, 'API Key is required')
})

type ApiKeyFormValues = z.infer<typeof ApiKeyFormSchema>

export default function AdminPage() {
  const apiKeyForm = useForm<ApiKeyFormValues>({
    resolver: zodResolver(ApiKeyFormSchema),
    defaultValues: {
      service: '',
      apiKey: ''
    }
  })

  const [isValidating, setIsValidating] = useState(false)
  const selectedService = apiKeyForm.watch('service')
  const [defaultModel, setDefaultModel] = useState<string>(DEFAULT_MODEL_ID)

  // Initialize the defaultModel from localStorage when on client
  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const storedModel = localStorage.getItem('default_model_id')
      if (storedModel) {
        setDefaultModel(storedModel)
      }
    }
  }, [])

  // Tìm thông tin dịch vụ được chọn trong supportedAIServices
  const selectedServiceInfo = supportedAIServices.find(service => service.key === selectedService)

  const { showAlert } = useAlertDialog()

  // Load saved API key when service changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const service = apiKeyForm.watch('service')
    if (service) {
      const savedKey = localStorage.getItem(`${service}_api_key`)
      if (savedKey) {
        apiKeyForm.setValue('apiKey', savedKey)
      } else {
        apiKeyForm.setValue('apiKey', '')
      }
    }
  }, [apiKeyForm.watch('service')])

  const handleClearAllApiKeys = () => {
    if (typeof window === 'undefined') return

    showAlert({
      title: 'Confirm Clear API Keys',
      description: 'This will remove all saved API keys. Are you sure you want to continue?',
      confirmText: 'Clear',
      confirmClassName: 'bg-destructive hover:bg-destructive/90',
      onConfirm: () => {
        supportedAIServices.forEach(service => {
          localStorage.removeItem(`${service.key}_api_key`)
        })
        apiKeyForm.setValue('apiKey', '')
        xtoast.success('All API keys have been cleared')
      }
    })
  }

  const handleDownloadDB = async () => {
    const chats = await db.chats.toArray()
    const messages = await db.messages.toArray()
    const data = { chats, messages }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tomchat-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleUploadDB = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    showAlert({
      title: 'Confirm Database Restore',
      description: 'This will replace all existing chats and messages. This action cannot be undone. Are you sure?',
      confirmText: 'Restore',
      confirmClassName: 'bg-destructive hover:bg-destructive/90',
      onConfirm: async () => {
        try {
          const text = await file.text()
          const data = JSON.parse(text)

          await db.transaction('rw', db.chats, db.messages, async () => {
            await db.chats.clear()
            await db.messages.clear()
            await db.chats.bulkAdd(data.chats)
            await db.messages.bulkAdd(data.messages)
          })

          xtoast.success('Database restored successfully!')
        } catch (error) {
          console.error('Error restoring database:', error)
          xtoast.error('Failed to restore database')
        }
      }
    })
  }

  // Function to validate API key for different services
  const validateApiKey = async (service: AIService, apiKey: string) => {
    setIsValidating(true)
    try {
      let isValid = false

      // Use API endpoint for validation
      try {
        const validationResponse = await fetch('/api/validate-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            service,
            apiKey
          })
        })

        if (!validationResponse.ok) {
          const errorText = await validationResponse.text().catch(() => 'Unknown error')
          console.error(`Proxy validation error (${service}):`, errorText)
          xtoast.error(`Validation service error: ${validationResponse.status} ${validationResponse.statusText}`)
          return false
        }

        const result = await validationResponse.json()
        isValid = result.isValid

        if (!isValid && result.error) {
          console.error(`${service} API error:`, result.error)
          xtoast.error(`API Error: ${result.error.message || 'Unknown error'}`)
        }
      } catch (error) {
        console.error(`Error validating ${service} key:`, error)
        xtoast.error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        return false
      }

      if (isValid && typeof window !== 'undefined') {
        localStorage.setItem(`${service}_api_key`, apiKey)
        xtoast.success(`API Key for ${service} is valid and has been saved`)
      } else {
        xtoast.error(`Invalid API Key for ${service}`)
      }

      return isValid
    } catch (error) {
      console.error(`Error validating ${service} API key:`, error)
      xtoast.error(`Error validating API Key: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return false
    } finally {
      setIsValidating(false)
    }
  }

  const onApiKeySubmit = async (data: ApiKeyFormValues) => {
    await validateApiKey(data.service as AIService, data.apiKey)
  }

  const handleModelChange = (modelId: string) => {
    if (typeof window === 'undefined') return

    const serviceInfo = getServiceInfoFromModelId(modelId)

    if (!serviceInfo) {
      xtoast.error('Unknown model service')
      return
    }

    const serviceApiKey = localStorage.getItem(`${serviceInfo.key}_api_key`)

    if (!serviceApiKey) {
      xtoast.warning(`Need an API key found for ${serviceInfo.name}.`)
      return
    }

    setDefaultModel(modelId)
    localStorage.setItem('default_model_id', modelId)
    xtoast.success('Default model has been saved')
  }

  return (
    <article className="container mx-auto flex flex-col gap-4 p-4">
      {/* Default AI Model */}
      <section className="flex flex-col gap-4 rounded-md border p-4">
        <div className="flex flex-col gap-2">
          <h2 id="default-model" className="text-lg font-medium">
            Default AI Model
          </h2>
          <div className="text-sm text-muted-foreground">
            Choose the default model to use when starting a new conversation.
          </div>
        </div>

        <div className="flex flex-row items-center gap-4">
          <div className="flex items-center">
            <ModelSelector selectedModelId={defaultModel} onModelChange={handleModelChange} className="w-auto" />
          </div>
        </div>
      </section>

      {/* AI Service API Keys */}
      <section className="flex flex-col gap-4 rounded-md border p-4">
        <div className="flex flex-col gap-2">
          <h2 id="api-keys" className="text-lg font-medium">
            AI Service API Keys
          </h2>
          <div className="text-sm text-muted-foreground">
            Add or update your API keys for the supported AI services. ☝ The keys are stored in your browser's local
            storage and never leave your device.
          </div>
        </div>

        <Form {...apiKeyForm}>
          <form onSubmit={apiKeyForm.handleSubmit(onApiKeySubmit)} className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-6">
              <FormField
                control={apiKeyForm.control}
                name="service"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-row items-center gap-4">
                    <FormLabel className="min-w-24 whitespace-nowrap">AI Service</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="!mt-0 h-9 w-60">
                          <SelectValue placeholder="Select a service">
                            {selectedServiceInfo && (
                              <div className="flex items-center gap-2">
                                {selectedServiceInfo.colorIcon && <selectedServiceInfo.colorIcon className="h-4 w-4" />}
                                <span>{selectedServiceInfo.name}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {supportedAIServices.map(service => (
                          <SelectItem key={service.key} value={service.key}>
                            <div className="flex items-center gap-2">
                              {service.colorIcon && <service.colorIcon className="h-4 w-4" />}
                              <span>{service.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-row items-center gap-6">
              <FormField
                control={apiKeyForm.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-row items-center gap-4">
                    <FormLabel className="min-w-24 whitespace-nowrap">API Key</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your API key" {...field} className="h-9" type="password" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {selectedServiceInfo?.apiDocUrl && (
              <div className="mt-1 text-xs text-muted-foreground">
                Need an API key? Visit{' '}
                <a
                  href={selectedServiceInfo.apiDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {selectedServiceInfo.name} documentation
                </a>{' '}
                to learn how to get one.
              </div>
            )}

            <div className="mt-2 flex flex-row gap-4">
              <Button
                className="h-9 rounded-3xl"
                variant="default"
                type="submit"
                disabled={isValidating || !selectedServiceInfo}
              >
                {isValidating ? 'Validating...' : 'Validate & Save'}
              </Button>
              <Button className="h-9 rounded-3xl" variant="secondary" type="button" onClick={handleClearAllApiKeys}>
                Clear All
              </Button>
            </div>
          </form>
        </Form>
      </section>

      {/* Database Backup */}
      <section className="flex flex-col gap-4 rounded-md border p-4">
        <div className="flex flex-col gap-2">
          <h2 id="database-backup" className="text-lg font-medium">
            Database Backup
          </h2>
          <div className="text-sm text-muted-foreground">
            Download creates a complete backup of all chats and messages. ⚠️ Restore will completely replace the current
            database with data from your backup file.
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <Button className="h-9 rounded-3xl" onClick={handleDownloadDB} variant="default">
            <Download className="h-4 w-4" /> Download
          </Button>
          <label className="flex h-9 cursor-pointer flex-row items-center gap-2 rounded-3xl bg-secondary p-4 text-sm text-secondary-foreground hover:bg-secondary/80">
            <Upload className="h-4 w-4" /> Restore
            <input type="file" id="db-upload" className="hidden" accept=".json" onChange={handleUploadDB} />
          </label>
        </div>
      </section>
    </article>
  )
}
