'use client'
import React from 'react'
import { Link, Share } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Separator } from '~/components/ui/separator'
import { Button } from '~/components/ui/button'
import Image from 'next/image'
import { XWInput } from '~/components/reusable/XWInput'


const ShareImageComponent = () => {
    const socialLinks = [
        {
            name: "Facebook",
            image: "/images/social/facebook.svg",
        },
        {
            name: "Instagram",
            image: "/images/social/instagram.svg",
        },
        {
            name: "Telegram",
            image: "/images/social/telegram.svg",
        },
        {
            name: "Whatsapp",
            image: "/images/social/whatsapp.svg",
        },
        {
            name: "X",
            image: "/images/social/x.svg",
        },

    ]
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"secondary"}>
                        Share <Share className=' h-4 w-4 ml-2' />
                    </Button>
                </DialogTrigger>
                <DialogContent className=' bg-xw-sidebar flex flex-col gap-4'>
                    <DialogHeader>
                        <DialogTitle className='text-left'>Share</DialogTitle>
                        <DialogDescription className=' hidden'>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>

                    <Separator />

                    <div>
                        <h1>Share this via</h1>

                        <div className=' my-2 flex items-center gap-2'>
                            {socialLinks.map((item, i) => (
                                <button key={i} className=' flex items-center gap-2 rounded-full p-3 border border-xw-secondary ring-0 outline-none hover:bg-xw-secondary'>
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={40}
                                        height={40}
                                    />
                                </button>
                            ))}
                        </div>

                    </div>

                    <Separator />


                    <div className='mt-4 flex items-center gap-2 w-full'>
                        <div className=' relative flex-1'>
                            <XWInput
                                type='text'
                                placeholder='Enter email address'
                                value={window.location.href}
                                className='flex-1 w-full pl-10 text-xw-muted'
                            />

                            <div className='absolute top-1/2 left-2 -translate-y-1/2'>
                                <Link className=' h-6 w-6' />
                            </div>
                        </div>
                        <Button variant={"default"} size={"sm"}>
                            Share
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ShareImageComponent
