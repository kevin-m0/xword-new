"use client";
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet"
import SoundVerseForm from './SoundVerseForm'
import { Menu } from 'lucide-react';
import XWSecondaryButton from '~/components/reusable/XWSecondaryButton';

const SoundVerseMobileForm = ({ refetchGeneratedAudios }: { refetchGeneratedAudios: () => void }) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <XWSecondaryButton size='icon'>
                    <Menu className='h-4 w-4' />
                </XWSecondaryButton>
            </SheetTrigger>
            <SheetContent className="px-0" side="left">
                <SheetHeader className="hidden">
                    <SheetTitle>Form</SheetTitle>
                    <SheetDescription>
                        Add your audio file here
                    </SheetDescription>
                </SheetHeader>
                <SoundVerseForm refetchGeneratedAudios={refetchGeneratedAudios}/>
            </SheetContent>
        </Sheet>
    )
}

export default SoundVerseMobileForm
