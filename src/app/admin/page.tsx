'use client'

import { useAlertDialog } from '@/components/dialog-confirm'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { bulkUpdateChatProperty } from '@/lib/chats'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControllerRenderProps, useForm } from 'react-hook-form'
import * as z from 'zod'

const FormSchema = z.object({
  property: z.string().min(1, 'Please select a property'),
  value: z.string().min(1, 'Please enter a value')
})

type FormValues = z.infer<typeof FormSchema>

export default function AdminPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      property: '',
      value: ''
    }
  })

  const { showAlert } = useAlertDialog()

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    showAlert({
      title: 'Confirm Bulk Update',
      description: `Are you sure you want to update the **${data.property}** property to "**${data.value}**" for all chats?\n\nThis action cannot be undone.`,
      confirmText: 'Update All',
      confirmClassName: 'bg-yellow-600 hover:bg-yellow-700',
      onConfirm: async () => {
        await bulkUpdateChatProperty(data.property as any, data.value)
        form.reset()
      }
    })
  }

  return (
    <div className="container mx-auto flex flex-col gap-4 p-8">
      <div>Use this page to interact directly with the database.</div>

      <section className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4">
        <h2 className="text-lg font-medium">Modify value of a property for all chats</h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-row items-center justify-between gap-6"
          >
            <FormField
              control={form.control}
              name="property"
              render={({ field }: { field: ControllerRenderProps<FormValues, 'property'> }) => (
                <FormItem className="flex flex-row items-center gap-4">
                  <FormLabel className="whitespace-nowrap">Chat Property</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="!mt-0 h-9 gap-4">
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

            <FormField
              control={form.control}
              name="value"
              render={({ field }: { field: ControllerRenderProps<FormValues, 'value'> }) => (
                <FormItem className="flex min-w-0 flex-1 flex-row items-center gap-4">
                  <FormLabel className="whitespace-nowrap">New Value</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      className="!mt-0 h-9"
                      placeholder="Enter new value"
                      auto-complete="false"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="h-9 rounded-3xl" variant="default" type="submit">
              Update
            </Button>
          </form>
        </Form>
      </section>
    </div>
  )
}
