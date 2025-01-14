'use client'

import { useAlertDialog } from '@/components/dialog-confirm'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTagStore } from '@/hooks/useTagStore'
import { bulkUpdateChatProperty } from '@/lib/chats'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControllerRenderProps, useForm } from 'react-hook-form'
import * as z from 'zod'

// Type-safe property selection
const CHAT_PROPERTIES = ['archived', 'hasNoTag', 'pinned', 'tags'] as const
type ChatProperty = (typeof CHAT_PROPERTIES)[number]

// Value types corresponding to Chat properties
type PropertyValues = {
  archived: 'true' | 'false'
  hasNoTag: 1 | 0
  pinned: 'true' | 'false'
  tags: string[]
}

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
    resolver: zodResolver(FormSchema),
    defaultValues: {
      property: 'archived',
      value: 'false'
    }
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
        )
      case 'hasNoTag':
        return (
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
        )
      case 'tags':
        return (
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
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
    }
  }

  return (
    <div className="container mx-auto flex flex-col gap-8 p-8">
      <header>
        <h1 className="text-xl font-semibold">Admin Configs</h1>
        <div className="text-sm text-muted-foreground mt-2">
          This page provides direct database management capabilities. IMPORTANT: Actions performed here will modify the
          database directly. This interface is primarily intended for database restructuring and fixing legacy data
          formats in the conversation database.
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-base font-medium">Modify value of a property for all chats</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-row items-center justify-between gap-6"
          >
            <div className="flex min-w-0 flex-1 flex-row items-center gap-6">
              <FormField
                control={form.control}
                name="property"
                render={({ field }: { field: ControllerRenderProps<FormValues, 'property'> }) => (
                  <FormItem className="flex flex-row items-center gap-4">
                    <FormLabel className="whitespace-nowrap">Chat Property</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="!mt-0 h-9 w-fit gap-4">
                          <SelectValue placeholder="Select property" />
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
    </div>
  )
}
