import { ArrowRight, Download, Paperclip } from 'lucide-react'
// import XWSecondaryButton from '../../../reusable/XWSecondaryButton'
import React, { useRef } from 'react'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/reusable/XWSelect'
// import { XWTextarea } from '../../../reusable/XWTextarea'
import { Separator } from '~/components/ui/separator'
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RemixUploadFormValues, remixUploadSchema } from './schemas'
import XWSecondaryButton from '~/components/reusable/XWSecondaryButton'
import { XWTextarea } from '~/components/reusable/XWTextarea'

const WXRemixTabUpload = () => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const form = useForm<RemixUploadFormValues>({
        resolver: zodResolver(remixUploadSchema),
        defaultValues: {
            remixInstructions: "",
            length: "medium"
        }
    })

    function onSubmit(data: RemixUploadFormValues) {
        console.log(data)
    }

    const handleFileSelect = () => {
        fileInputRef.current?.click()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 flex flex-col gap-5'>
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".mp3,.mp4,.wav"
                />

                <div className="py-10 w-full flex flex-col rounded-[16px] border-dashed border-xw-secondary bg-xw-background border-[2px]">
                    <div className='w-full p-5 text-center my-auto flex flex-col gap-2'>
                        <Download className='h-10 w-10 mx-auto' />
                        <h1 className='text-xl font-semibold text-xw-muted-foreground'>
                            Drag & Drop your Audio files
                        </h1>
                        <p className='text-xw-muted text-sm'>
                            .mp3, .mp4 and .wav are supported.
                        </p>

                        <div className='mt-5 mx-auto flex items-center gap-2'>
                            <XWSecondaryButton size='sm' onClick={handleFileSelect}>
                                <Paperclip className='h-4 w-4' />
                                Select Source
                            </XWSecondaryButton>
                            <XWSecondaryButton size='sm'>
                                Record Audio
                            </XWSecondaryButton>
                        </div>
                    </div>
                </div>

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

export default WXRemixTabUpload
