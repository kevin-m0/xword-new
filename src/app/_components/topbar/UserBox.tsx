import React from 'react'
import Link from 'next/link'
import { Settings } from 'lucide-react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from '~/components/ui/button'
import { Skeleton } from "~/components/ui/skeleton"

export function SkeletonDemo() {
    return (
        <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

const UserBox = () => {
    const { user } = useUser();

    if (!user) {
        return <>
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </>
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Avatar className='h-8 w-8'>
                    <AvatarImage src={user.imageUrl}  />
                    <AvatarFallback>{user?.firstName}</AvatarFallback>
                </Avatar>
            </PopoverTrigger>
            <PopoverContent className=' w-80 mr-2 flex flex-col gap-2'>
                <div className=' border border-xw-secondary p-2 rounded-lg flex items-center'>
                    <Avatar>
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback>{user?.firstName?.charAt(0)?.toUpperCase() }</AvatarFallback>
                    </Avatar>
                    <div className=' ml-2 flex flex-col'>
                        <span className=' text-white'>{user?.fullName}</span>
                        <span className=' text-xs text-xw-muted'>{user?.primaryEmailAddress?.emailAddress}</span>
                    </div>
                </div>

                <Link href={"/settings"} className=' w-full'>
                    <Button variant={"ghost"} className=' w-full justify-start gap-2'>
                        <Settings className=' h-4 w-4' /> General Settings
                    </Button>
                </Link>
                <Link href={"/"} className=' w-full'>
                    <Button variant={"ghost"} className=' w-full justify-start gap-2'>
                        <Image
                            src={"/icons/Crown.svg"}
                            width={15}
                            height={15}
                            alt='crown'
                        />
                        Manage Plan
                    </Button>
                </Link>

                <Link href={"/"} className=' w-full'>
                    <Button variant={"default"} className=' w-full justify-start gap-2'>
                        Update Plan
                    </Button>
                </Link>

                <Link href={"/"} className=' w-full'>
                    <Button className=' w-full justify-start gap-2' variant={"ghost"}>
                        <Image
                            src={"/icons/logout.svg"}
                            width={15}
                            height={15}
                            alt='logout'
                        />
                        Sign Out
                    </Button>
                </Link>
            </PopoverContent>
        </Popover>

    )
}

export default UserBox
