'use client';

import React, { useState } from 'react'
import { Check, ChevronRight, ArrowRight } from 'lucide-react'
import { Separator } from '~/components/ui/separator'
import { Button } from '~/components/ui/button'
// import XWSecondaryButton from '../../../reusable/XWSecondaryButton';
// import { XWInput } from '../../../reusable/XWInput';
// import { XWTextarea } from '../../../reusable/XWTextarea';
import Image from 'next/image';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// import { outlineFormSchema, type OutlineFormValues } from "../../../../_lib/schemas/writer-flow-schemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { outlineFormSchema, OutlineFormValues } from '~/lib/schemas/writer-flow-schemas';
import { XWInput } from '~/components/reusable/XWInput';
import { XWTextarea } from '~/components/reusable/XWTextarea';
import XWSecondaryButton from '~/components/reusable/XWSecondaryButton';

interface WXCreateTabFlowThreeProps {
    onNext: (data: OutlineFormValues) => void;
    onBack: () => void;
}

const WXCreateTabFlowThree = ({ onNext, onBack }: WXCreateTabFlowThreeProps) => {
    const form = useForm<OutlineFormValues>({
        resolver: zodResolver(outlineFormSchema),
        defaultValues: {
            targetAudience: "",
            introduction: "",
            outline: "",
        }
    })

    const onSubmit = (data: OutlineFormValues) => {
        onNext(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-4xl w-full mx-auto">
                <h1 className='text-3xl font-bold p-4'>Blog Outline</h1>

                <Separator />

                <div className='w-full p-4 flex flex-col gap-8'>
                    {/* Main content will go here */}
                    <h1 className=' text-xl font-semibold'>
                        Edit your outline as desired.
                    </h1>

                    <FormField
                        control={form.control}
                        name="targetAudience"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Who is the target audience?</FormLabel>
                                <FormControl>
                                    <XWInput {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className=' flex flex-col gap-2'>
                        <h1>Introduction</h1>
                        <XWTextarea className=' text-xw-muted text-base min-h-[300px]' placeholder='e.g. "Welcome to our blog! We are a team of passionate entrepreneurs, marketers, and business owners who are dedicated to sharing our knowledge and experiences with you."'
                            value={`In today's fast-paced work environment, mastering your schedule is more crucial than ever for busy professionals seeking to thrive. With the ever-increasing demands of a competitive job market, effective time management strategies are essential to maintaining productivity and achieving a sustainable work-life balance. Entrepreneurs, managers, and professionals across industries can benefit from honing these skills to manage their time effectively, ensuring they accomplish their goals while reducing stress. This guide will provide valuable insights and productivity tips for professionals looking to enhance their efficiency and focus. Explore the key time management tools and techniques that can transform your daily routine and elevate your professional life.`}
                        />
                    </div>
                    <div className='flex justify-end'>
                        <XWSecondaryButton>
                            <Image
                                src={"/icons/magic.svg"}
                                alt='magic'
                                height={15}
                                width={15}
                            />
                            Regenerate Introduction
                        </XWSecondaryButton>
                    </div>

                    <Separator />

                    <div>
                        <h1 className=' text-xl font-semibold'>
                            This is your blog&apos;s outline.
                        </h1>
                    </div>

                    <div className=' flex flex-col gap-2'>
                        <h1>Press Enter to add new headings and use Tab/Shift+Tab to adjust indentation.</h1>
                        <XWTextarea className=' min-h-[300px] text-lg font-medium text-xw-muted'
                            value={`
                                    H2    Prioritizing Tasks for Maximum Impact

                                    H3    Understanding Urgency vs. Importance
                                    H3    The Power of the To-Do List
                                    H3    Setting Realistic Goals and Deadlines

                                    H2    Leveraging Technology to Save Time

                                    H3    Essential Time Management Tools
                                    H3    Automating Routine Tasks 
                                    H3    Integrating Calendars and Reminders 

                                    H2    Achieving Work-Life Balance

                                    H3    Setting Boundaries and Limits
                                    H3    Scheduling Downtime and Breaks
                                    H3    Delegating for Better Balance
                                `}
                        />

                    </div>

                    <div className='flex justify-end'>
                        <XWSecondaryButton>
                            <Image
                                src={"/icons/magic.svg"}
                                alt='magic'
                                height={15}
                                width={15}
                            />
                            Regenerate Headers
                        </XWSecondaryButton>
                    </div>
                </div>

                <Separator />

                <div className='w-full flex items-center gap-2 p-4'>
                    <XWSecondaryButton size='sm'>
                        Previous Step
                    </XWSecondaryButton>
                    <div className="flex items-center gap-2 ml-auto mr-0">
                        <XWSecondaryButton size='sm'>
                            New Outline
                        </XWSecondaryButton>
                        <Button variant={"default"} size={"sm"}>
                            Generate Document <ArrowRight className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default WXCreateTabFlowThree
