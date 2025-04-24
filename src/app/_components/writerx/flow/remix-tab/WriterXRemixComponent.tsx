import { Button } from '~/components/ui/button'
import React from 'react'
// import { XWTextarea } from '../../../reusable/XWTextarea'
import { Separator } from '~/components/ui/separator'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../reusable/XWSelect'
import { ArrowRight } from 'lucide-react'
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RemixTextFormValues, remixTextSchema } from './schemas'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/reusable/XWSelect'
import { XWTextarea } from '~/components/reusable/XWTextarea'

const WriterXRemixComponent = () => {
    const form = useForm<RemixTextFormValues>({
        resolver: zodResolver(remixTextSchema),
        defaultValues: {
            content: "",
            remixInstructions: "",
            length: "medium"
        }
    })

    function onSubmit(data: RemixTextFormValues) {
        console.log(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 flex flex-col gap-5'>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-2'>
                            <label htmlFor="">Enter text</label>
                            <FormControl>
                                <XWTextarea {...field} placeholder='Paste your content here...' rows={5} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Separator />

                <FormField
                    control={form.control}
                    name="remixInstructions"
                    render={({ field }) => (
                        <FormItem className='mt-5 flex flex-col gap-2'>
                            <label htmlFor="">How would you like to remix?</label>
                            <FormControl>
                                <XWTextarea {...field} placeholder='Paste your content here...' rows={5} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <p className='text-sm text-xw-muted'>
                    Get better outputs by providing as much information as you can.
                </p>

                <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-2'>
                            <label htmlFor="">Length</label>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select length' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="short">Short</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="long">Long</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <div className='mt-auto mb-0 flex items-center justify-end'>
                    <Button
                        type="submit"
                        variant={"default"}
                        className='text-sm h-9'
                        disabled={!form.formState.isValid || form.formState.isSubmitting}
                    >
                        Remix Content <ArrowRight className='h-4 w-4 ml-2' />
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default WriterXRemixComponent
