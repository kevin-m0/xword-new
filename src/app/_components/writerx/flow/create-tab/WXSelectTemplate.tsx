import React from 'react'
// import XWSecondaryButton from '../../../reusable/XWSecondaryButton'
import { ArrowLeft } from 'lucide-react'
// import { XWInput } from '../../../reusable/XWInput'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../reusable/XWSelect'
import { Separator } from '~/components/ui/separator'
import Image from 'next/image'
import XWSecondaryButton from '~/components/reusable/XWSecondaryButton'
import { XWInput } from '~/components/reusable/XWInput'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/reusable/XWSelect'

interface WXSelectTemplateProps {
    onBack: () => void
    onTemplateSelect: () => void
}

interface SocialTemplate {
    name: string;
    icon: string;
}

const socialTemplates: SocialTemplate[] = [
    {
        name: "Instagram Post",
        icon: "/images/social/instagram.svg"
    },
    {
        name: "LinkedIn Post",
        icon: "/images/contentverse/linkedin.svg"
    },
    {
        name: "X/Twitter Thread Post",
        icon: "/images/contentverse/x-twitter.svg"
    },
    {
        name: "Facebook Text Post",
        icon: "/images/social/facebook.svg"
    },
    {
        name: "X/Twitter Text Post",
        icon: "/images/contentverse/x-twitter.svg"
    }
]

const WXSelectTemplate = ({ onBack, onTemplateSelect }: WXSelectTemplateProps) => {
    return (
        <div className='flex flex-col gap-5'>
            <div className='flex items-center gap-4'>
                <div>
                    <XWSecondaryButton
                        rounded='full'
                        size='icon'
                        onClick={onBack}
                    >
                        <ArrowLeft className='h-6 w-6' />
                    </XWSecondaryButton>
                </div>
                <h1 className='text-2xl font-bold'>Select a Template</h1>
            </div>

            <div className='grid grid-cols-5 gap-2'>
                <div className='col-span-3'>
                    <XWInput placeholder='Search for a template' />
                </div>
                <div className='col-span-2'>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder='Select a template' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='blog-post'>Blog Post</SelectItem>
                            <SelectItem value='social-media'>Social Media</SelectItem>
                            <SelectItem value='youtube-script'>YouTube Script</SelectItem>
                            <SelectItem value='email'>Email</SelectItem>
                            <SelectItem value='landing-page'>Landing Page</SelectItem>
                            <SelectItem value='product-description'>Product Description</SelectItem>
                            <SelectItem value='ad-copy'>Ad Copy</SelectItem>
                            <SelectItem value='press-release'>Press Release</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Separator />

            <div className='flex flex-col gap-2'>
                <h1>Social Media</h1>

                <div className='grid grid-cols-2 gap-2'>
                    {socialTemplates.map((template, index) => (

                        <XWSecondaryButton
                            key={index}
                            onClick={onTemplateSelect}
                        >
                            <Image
                                src={template.icon}
                                alt={template.name.toLowerCase()}
                                width={20}
                                height={20}
                            />
                            <span>{template.name}</span>
                        </XWSecondaryButton>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default WXSelectTemplate
