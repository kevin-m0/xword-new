'use client';

import React, { useState } from 'react'
import { Check, ChevronRight, ArrowRight, Pencil, Plus, Minus } from 'lucide-react'
import { Separator } from '~/components/ui/separator'
import { Button } from '~/components/ui/button'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { titleFormSchema, TitleFormValues } from '~/lib/schemas/writer-flow-schemas';
import { XWRadioGroup, XWRadioItem } from '~/components/reusable/XWRadio';
import { XWTextarea } from '~/components/reusable/XWTextarea';
import XWSecondaryButton from '~/components/reusable/XWSecondaryButton';
import XWBadge from '~/components/reusable/XWBadge';
import { contentType } from '~/lib/contentVerse';

interface WXCreateTabFlowTwoProps {
    onNext: (data: TitleFormValues) => void;
    onBack: () => void;
}

const WXCreateTabFlowTwo = ({ onNext, onBack }: WXCreateTabFlowTwoProps) => {
    const form = useForm<TitleFormValues>({
        resolver: zodResolver(titleFormSchema),
        defaultValues: {
            selectedTitle: "",
            customTitle: "",
        }
    })

    const onSubmit = (data: TitleFormValues) => {
        onNext(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-4xl w-full mx-auto">
                <h1 className='text-3xl font-bold p-4'>Select Title</h1>

                <Separator />

                <div className='w-full p-4 flex flex-col gap-8'>
                    <div className='w-full flex flex-col gap-8'>
                        <p className="text-lg font-medium">Select your preferred title</p>

                        <FormField
                            control={form.control}
                            name="selectedTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <XWRadioGroup
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            className="flex flex-col gap-6"
                                        >
                                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                                <div key={num} className="flex items-center gap-6">
                                                    <div>
                                                        <XWRadioItem
                                                            value={num.toString()}
                                                            id={`title-${num}`}
                                                        />

                                                    </div>
                                                    <div className=" flex-1 flex flex-col gap-2">
                                                        <label
                                                            htmlFor={`title-${num}`}
                                                            className="text-sm "
                                                        >
                                                            Title #{num}
                                                        </label>
                                                        <div>
                                                            <XWTextarea
                                                                rows={1}
                                                                placeholder={`Enter title ${num}`}
                                                                className="min-h-0"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </XWRadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <XWSecondaryButton>
                                <Pencil className='h-4 w-4' /> Write your own
                            </XWSecondaryButton>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h1>Your SEO keys we tried to include in the above titles.</h1>

                        <div className=' flex flex-wrap gap-2 mt-4'>
                            {contentType.map((item, index) => (
                                <XWBadge key={index} className=' rounded-md px-3 py-1 text-sm'>
                                    {item}
                                </XWBadge>
                            ))}
                        </div>
                    </div>

                </div >

                <Separator />

                <div className='w-full flex items-center gap-2 p-4'>
                    <XWSecondaryButton size='sm' onClick={onBack}>
                        Previous Step
                    </XWSecondaryButton>
                    <div className="flex items-center gap-2 ml-auto mr-0">
                        <XWSecondaryButton size='sm'>
                            New Titles
                        </XWSecondaryButton>

                        <Button variant={"default"} size={"sm"}>
                            Generate Outline <ArrowRight className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default WXCreateTabFlowTwo
