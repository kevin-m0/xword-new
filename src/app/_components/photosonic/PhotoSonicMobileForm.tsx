import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet"
import { Menu } from 'lucide-react'
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area'
import PhotoSonicForm from './PhotoSonicForm'
import XWSecondaryButton from '~/components/reusable/XWSecondaryButton'


const PhotoSonicMobileForm = ({ userId }: { userId: string }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <XWSecondaryButton size='icon'>
                    <Menu className='h-4 w-4' />
                </XWSecondaryButton>
            </SheetTrigger>
            <SheetContent className=' max-w-sm w-full flex flex-col px-0'>
                <ScrollArea className=' w-full'>
                    <SheetHeader className=' hidden'>
                        <SheetTitle>Are you absolutely sure?</SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </SheetDescription>
                    </SheetHeader>

                    <PhotoSonicForm userId={userId} />
                    <ScrollBar />
                </ScrollArea>

            </SheetContent>
        </Sheet>

    )
}

export default PhotoSonicMobileForm
