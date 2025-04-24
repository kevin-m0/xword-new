'use client';

import React, { useState } from 'react'
import { ChevronRight, Folder, ChevronDown, Plus, Minus, ArrowRight } from 'lucide-react'
import { Separator } from '~/components/ui/separator'
// import { XWTextarea } from '../../../reusable/XWTextarea'
// import XWSecondaryButton from '../../../reusable/XWSecondaryButton'
import { Button } from '~/components/ui/button'
// import { XWInput } from '../../../reusable/XWInput'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../reusable/XWSelect'
// import XWSelectTags from '../../../reusable/XWSelectTags'/
import { Switch } from '~/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
// import { XWDropdown, XWDropdownContent, XWDropdownItem } from '../../../reusable/xw-dropdown';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
// import { purposeFormSchema, type PurposeFormValues } from "../../../../_lib/schemas/writer-flow-schemas"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { XWInput } from '~/components/reusable/XWInput';
import { purposeFormSchema, PurposeFormValues } from '~/lib/schemas/writer-flow-schemas';
import { XWTextarea } from '~/components/reusable/XWTextarea';
import XWSecondaryButton from '~/components/reusable/XWSecondaryButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/reusable/XWSelect';
import XWSelectTags from '~/components/reusable/XWSelectTags';

interface BlogPostData {
    keywords: string[];
}

interface ConfigureItemProps {
    title: string;
    description: string;
    placeholder?: string;
}

const ConfigureItem = ({ title, description, placeholder }: ConfigureItemProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <div className={`${isOpen ? 'rotate-180' : ''} transition-all`}>
                        {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </div>
                    <span className="text-xw-muted ">{title}</span>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pl-7">
                <p className="text-sm text-xw-muted">{description}</p>
                <div className="max-w-[800px] w-full">
                    <XWInput placeholder={placeholder} className="w-full" />
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
};

const goalOptions = [
    { value: "promotion", label: "Promotion" },
    { value: "awareness", label: "Brand Awareness" },
    { value: "engagement", label: "Engagement" },
    { value: "education", label: "Education" },
    { value: "sales", label: "Sales" },
]

const brandVoiceOptions = [
    { value: "professional", label: "Professional" },
    { value: "casual", label: "Casual" },
    { value: "friendly", label: "Friendly" },
    { value: "authoritative", label: "Authoritative" },
    { value: "humorous", label: "Humorous" },
]

const postLengthOptions = [
    { value: "short", label: "Short (300-500 words)" },
    { value: "medium", label: "Medium (500-1000 words)" },
    { value: "long", label: "Long (1000-1500 words)" },
    { value: "detailed", label: "Detailed (1500+ words)" },
]

interface WXCreateFlowOneProps {
    onNext: (data: PurposeFormValues) => void;
}

const WXCreateFlowOne = ({ onNext }: WXCreateFlowOneProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<PurposeFormValues>({
        resolver: zodResolver(purposeFormSchema),
        defaultValues: {
            documentName: "",
            folder: "",
            goal: "",
            brandVoice: "",
            targetAudience: "",
            postLength: "",
            keywords: [],
            includeImage: false,
            materialSource: "",
            language: "en"
        }
    })

    const handleKeywordsChange = (newKeywords: string[]) => {
        form.setValue('keywords', newKeywords);
    };

    const onSubmit = (data: PurposeFormValues) => {
        onNext(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2 max-w-4xl w-full mx-auto">
                <h1 className=' text-3xl font-bold p-4'>Blog Post</h1>

                <Separator />

                <div className=' p-4 flex flex-col gap-2'>
                    <h1>What would you like to write about?</h1>

                    <XWTextarea />

                    <div className=' mt-4 flex items-center gap-2 mr-0 ml-auto'>
                        <XWSecondaryButton>
                            I&apos;ll fit it myself
                        </XWSecondaryButton>

                        <Button size={"sm"} variant={"default"}>Generate The Rest</Button>
                    </div>
                </div>

                <div className=' flex flex-col gap-8 p-4'>

                    <div className='flex flex-col gap-2 w-full'>
                        <p>Name your doc and select a location</p>
                        <div className='flex gap-2 items-center w-full'>
                            <FormField
                                control={form.control}
                                name="documentName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name your doc</FormLabel>
                                        <FormControl>
                                            <XWInput {...field} placeholder="Name your doc" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='max-w-[200px] w-full'>
                                <Select>
                                    <SelectTrigger>
                                        <div className='flex items-center gap-2'>
                                            <Folder className='h-4 w-4' />
                                            <span>Folder</span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1</SelectItem>
                                        <SelectItem value="2">2</SelectItem>
                                        <SelectItem value="3">3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <p>What is the goal of this post?</p>
                        <div className='max-w-[200px] w-full'>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select a goal' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Promotion</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <p>Select a custom brand voice up to three tones?</p>
                        <div className='max-w-[400px] w-full'>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select a custom brand voice' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Promotion</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <p>Who is the target audience?</p>
                        <div className=' w-full'>
                            <XWInput placeholder='Describe your target audience' />
                        </div>
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <p>How long should this post be?</p>
                        <div className='max-w-[400px] w-full'>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select post length' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="short">Short (300-500 words)</SelectItem>
                                    <SelectItem value="medium">Medium (500-1000 words)</SelectItem>
                                    <SelectItem value="long">Long (1000-1500 words)</SelectItem>
                                    <SelectItem value="detailed">Detailed (1500+ words)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <p>What Keywords should be included?</p>
                        <div className='w-full'>
                            <FormField
                                control={form.control}
                                name="keywords"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <XWSelectTags
                                                value={field.value}
                                                onChange={handleKeywordsChange}
                                                placeholder="Add keywords..."
                                                maxTags={5}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className='flex justify-between gap-2 w-full'>
                        <div>
                            <p>Select a custom brand voice up to three tones?</p>
                            <span className=' text-xw-muted text-sm'>
                                An image will make your posts far more engaging and attention grabbing
                            </span>
                        </div>
                        <Switch />
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        <p>Select a source of material.</p>
                        <div className='max-w-[400px] w-full'>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select a source of material' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Promotion</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">More ways to configure</h2>
                            <p className="text-xw-muted">Add more specific information to make your content better</p>
                        </div>

                        <ConfigureItem
                            title="Call to action"
                            description="What should the reader think, feel or do next"
                            placeholder="Enter call to action..."
                        />

                        <ConfigureItem
                            title="Author Persona"
                            description="Who should the post be written as (e.g. Tech CEO)"
                            placeholder="Enter author persona..."
                        />

                        <ConfigureItem
                            title="Product/Service Description"
                            description="Describe your product in 1-3 sentences"
                            placeholder="Enter product description..."
                        />

                        <ConfigureItem
                            title="Avoid"
                            description="Add specific words, phrases or concepts to avoid"
                            placeholder="Enter terms to avoid..."
                        />

                        <ConfigureItem
                            title="Additional info"
                            description="Anything else that doesn't fall in these categories"
                            placeholder="Enter additional information..."
                        />
                    </div>

                    <Separator />

                    <div className='w-full'>
                        <div className='w-fit flex items-center gap-2 ml-auto mr-0'>
                            <p>Generate in</p>

                            <div className="flex items-center gap-2 flex-1">
                                <div className="w-[160px]">
                                    <Select>
                                        <SelectTrigger>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <SelectValue placeholder="English (default)" className='text-sm' />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English (default)</SelectItem>
                                            <SelectItem value="es">Spanish</SelectItem>
                                            <SelectItem value="fr">French</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button variant={"default"} size={"sm"}>
                                    Generate Titles <ArrowRight className='h-4 w-4 ml-2' />
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="flex justify-end mt-4">
                    <Button type="submit" variant="default">
                        Next <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default WXCreateFlowOne
