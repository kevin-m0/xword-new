import React from 'react'
import Image from 'next/image'
import { Bell, Settings } from 'lucide-react'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import XWGradDiv from '~/components/reusable/XWGradDiv'
import XWButton from '~/components/reusable/XWButton'


const NotificationBlack = () => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className=' hover:bg-xw-secondary' size={"icon"}>
                    <Bell className=' h-4 w-4 text-white' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className=' h-96 w-80 border-none flex flex-col'>
                <XWGradDiv className=' flex-1 w-full flex flex-col gap-2 py-5 px-2'>
                    <div className=' p-2 flex items-center justify-between gap-2'>
                        <h1 className=' font-semibold text-lg'>Notifications</h1>
                        <Settings className='h-6 w-6' />
                    </div>
                    <Separator />



                    <div className=' flex-1'>
                        <div className=' h-full flex flex-col justify-center items-center text-center gap-2'>
                            <Image
                                src={"/icons/belloff.svg"}
                                height={40}
                                width={40}
                                alt='bell off'
                            />

                            <p>You have no notifications.</p>
                        </div>
                    </div>

                    <Separator />
                    <div className=' p-2 flex items-center justify-between gap-2'>
                        <h1 className=' text-sm'>0 unread</h1>
                        <XWButton size='sm' className1=' text-sm' disabled>Mark all as read</XWButton>
                    </div>
                </XWGradDiv>
            </PopoverContent>
        </Popover>
    )
}

export default NotificationBlack
