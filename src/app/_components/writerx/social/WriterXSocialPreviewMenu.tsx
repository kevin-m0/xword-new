import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import React from 'react'
import { CalendarRange } from 'lucide-react'
import Image from 'next/image'
import { Button } from '~/components/ui/button'

const WriterXSocialPreviewMenu = () => {
    const menu = [
        {
            image: "/icons/editor/preview-post.svg",
            title: "preview post",
            description: "Preview social media posts exactly as they would look after posting"
        },
        {
            image: "/icons/editor/schedule-post.svg",
            title: "Schedule to post automatically",
            description: "Automatically post your content on a scheduled time & date"
        },
        {
            image: "/icons/editor/reminder.svg",
            title: "Set a reminder to post",
            description: "Get a notification on the scheduled time & date"
        },
        {
            image: "/icons/editor/marked.svg",
            title: "Mark as posted",
            description: "Changes the status to “Posted” on the content calendar"
        },
        {
            image: "/icons/editor/export.svg",
            title: "Export",
            description: "Use Zapier or WordPress to export your content"
        },
        {
            image: "/icons/editor/copy.svg",
            title: "Copy Doc content",
            description: "Copy your doc to the clipboard to paste into another product"
        }
    ]
    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <div>

                        <Button variant={"outline"}>
                            Schedule <CalendarRange className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </PopoverTrigger>

                <PopoverContent className=' max-w-xs w-full mr-2'>
                    <div className='flex flex-col gap-2'>
                        {menu.map((item, index) => (
                            <div key={index}
                                className='flex w-full justify-start gap-2 items-start p-2 hover:bg-xw-secondary rounded-lg cursor-pointer'
                            >
                                <div className='p-1'>
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={16}
                                        height={16}
                                    />
                                </div>
                                <p className='flex-1'>
                                    <span className=' mb-2'>
                                        {item.title}
                                    </span>
                                    <p className=' text-sm text-xw-muted'>
                                        {item.description}
                                    </p>
                                </p>

                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default WriterXSocialPreviewMenu
