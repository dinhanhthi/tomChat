'use client'

import { useAlertDialog } from '@/components/dialog-confirm'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { db } from '@/db/database'
import { useTagStore } from '@/hooks/useTagStore'
import { bulkUpdateChatProperty } from '@/lib/chats'
import { zodResolver } from '@hookform/resolvers/zod'
import { TriangleAlert, Upload } from 'lucide-react'
import { ControllerRenderProps, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import TagIndicator from '../../components/tag-indicator'

const FormSchema = z.discriminatedUnion('property', [
  z.object({
    property: z.literal('archived'),
    value: z.enum(['true', 'false'])
  }),
  z.object({
    property: z.literal('hasNoTag'),
    value: z.enum(['0', '1']) // Keep as string, don't transform
  }),
  z.object({
    property: z.literal('pinned'),
    value: z.enum(['true', 'false'])
  }),
  z.object({
    property: z.literal('tags'),
    value: z.string()
  })
])

type FormValues = z.infer<typeof FormSchema>

export default function AdminPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema)
  })
  const { tags } = useTagStore()
  const selectedProperty = form.watch('property')

  const { showAlert } = useAlertDialog()

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const value =
      data.property === 'hasNoTag'
        ? Number(data.value)
        : data.property === 'tags' && data.value === 'empty'
          ? []
          : data.value

    showAlert({
      title: 'Confirm Bulk Update',
      description: `Are you sure you want to update the **${data.property}** property to "**${
        Array.isArray(value) ? '[]' : value
      }**" for all chats?\n\nThis action cannot be undone.`,
      confirmText: 'Update All',
      confirmClassName: 'bg-yellow-600 hover:bg-yellow-700',
      onConfirm: async () => {
        await bulkUpdateChatProperty(data.property as any, value)
        form.reset()
      }
    })
  }

  const renderValueInput = ({ field }: { field: ControllerRenderProps<FormValues, 'value'> }) => {
    switch (selectedProperty) {
      case 'archived':
      case 'pinned':
        return (
          <FormItem className="flex flex-row items-center gap-4">
            <FormLabel className="whitespace-nowrap">Value</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="!mt-0 h-9 w-fit gap-4">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="true">true</SelectItem>
                <SelectItem value="false">false</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )
      case 'hasNoTag':
        return (
          <FormItem className="flex flex-row items-center gap-4">
            <FormLabel className="whitespace-nowrap">Value</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="!mt-0 h-9 w-fit gap-4">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="0">0</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )
      case 'tags':
        return (
          <FormItem className="flex flex-row items-center gap-4">
            <FormLabel className="whitespace-nowrap">Value</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="!mt-0 h-9 w-fit gap-4">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="empty">Empty</SelectItem>
                {tags.map(tag => (
                  <SelectItem key={tag.name} value={tag.name}>
                    <div className="flex flex-row flex-nowrap items-center gap-2">
                      {tag.name}
                      <TagIndicator tagColor={tag.color} />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )
    }
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

          toast.success('Database restored successfully!')
        } catch (error) {
          console.error('Error restoring database:', error)
          toast.error('Failed to restore database')
        }
      }
    })
  }

  return (
    <article className="container mx-auto flex flex-col gap-10 p-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Admin Configs</h1>
          <div className="text-sm text-muted-foreground">
            This page provides direct database management capabilities. Actions performed here will modify the database
            directly. This interface is primarily intended for database restructuring and fixing legacy data formats in
            the conversation database.
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 border-orange-700 bg-orange-100 p-4 text-sm">
          <TriangleAlert className="h-5 w-5" />
          <div>This page is intended for advanced users only. Please proceed with caution.</div>
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-medium">Modify value of a property for all chats</h2>
          <div className="text-sm text-muted-foreground">
            In case you want to add/update a property value in the chat.
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-row items-center gap-6">
            <div className="flex flex-row items-center gap-6">
              <FormField
                control={form.control}
                name="property"
                render={({ field }: { field: ControllerRenderProps<FormValues, 'property'> }) => (
                  <FormItem className="flex flex-row items-center gap-4">
                    <FormLabel className="whitespace-nowrap">Chat Property</FormLabel>
                    <Select
                      onValueChange={value => {
                        field.onChange(value)
                        form.setValue('value', '')
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="!mt-0 h-9 w-fit gap-4">
                          <SelectValue placeholder="Select a property" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="archived">archived</SelectItem>
                        <SelectItem value="hasNoTag">hasNoTag</SelectItem>
                        <SelectItem value="pinned">pinned</SelectItem>
                        <SelectItem value="tags">tags</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField control={form.control} name="value" render={renderValueInput} />
            </div>
            <Button className="h-9 rounded-3xl" variant="default" type="submit">
              Update
            </Button>
          </form>
        </Form>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-medium">Database Backup</h2>
          <div className="text-sm text-muted-foreground">
            Download creates a backup of all chats and messages. Restore will completely replace the current database.
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <Button onClick={handleDownloadDB} variant="secondary">
            Download Backup
          </Button>
          <label className="flex h-9 cursor-pointer flex-row items-center gap-2 rounded-md bg-orange-200 p-4 text-sm text-orange-900">
            <Upload className="h-4 w-4" /> Restore Database
            <input type="file" id="db-upload" className="hidden" accept=".json" onChange={handleUploadDB} />
          </label>
        </div>
      </section>
    </article>
  )
}
