import React from 'react'
import { Bell, Calendar, Settings } from 'lucide-react'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"


const NotificationBar = () => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"secondary"} size={"icon"}>
                    <Bell className=' h-4 w-4 text-white' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className=' w-80 gap-2 flex flex-col mr-2'>
                <div className=' p-2 flex items-center justify-between gap-2'>
                    <h1 className=' font-semibold text-lg'>Notifications</h1>
                    <Settings className='h-6 w-6' />
                </div>
                <Separator />

                <div className=' flex gap-2 w-full rounded-md p-2 border border-xw-border bg-xw-card-hover'>
                    <Avatar>
                        <AvatarImage src="/images/user10.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className=' flex-1'>
                        <div className=' flex justify-between gap-2'>
                            <h1>John Doe</h1>
                            <p className=' text-xs'>2 hours ago</p>
                        </div>
                        <p className=' text-sm text-xw-muted'>
                            Invited you to join the workspace.
                        </p>
                    </div>
                </div>

                <div className=' flex gap-2 w-full rounded-md p-2 border border-xw-border'>
                    <Avatar className=' bg-xw-background'>
                        <AvatarFallback className='bg-xw-background'>
                            <Calendar className=' h-4 w-4' />
                        </AvatarFallback>
                    </Avatar>
                    <div className=' flex-1'>
                        <div className=' flex justify-between gap-2'>
                            <h1>John Doe</h1>
                        </div>
                        <p className=' text-sm text-xw-muted'>
                            Invited you to join the workspace.
                        </p>
                    </div>
                </div>
                <Separator />
                <div className=' p-2 flex items-center justify-between gap-2'>
                    <h1 className=' text-sm'>2 unread</h1>
                    <Button size='sm' variant={"secondary"}>Mark all as read</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default NotificationBar
