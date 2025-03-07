"use client";
import React, { useState, useRef } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Mic } from 'lucide-react';
import XWSecondaryButton from '~/components/reusable/XWSecondaryButton';
import XWGradSeparator from '~/components/reusable/XWGradSeparator';

const RecordVoceFlow = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const timerRef = useRef<NodeJS.Timeout>();

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startRecording = () => {
        setIsRecording(true);
        // Simulate timer
        timerRef.current = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);
    };

    const stopRecording = () => {
        setIsRecording(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setRecordingTime(0);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <XWSecondaryButton>
                    <Mic className='h-4 w-4' />
                    Voice
                </XWSecondaryButton>
            </DialogTrigger>

            <DialogContent className='bg-xw-sidebar max-w-md w-full flex flex-col gap-5'>
                <DialogHeader>
                    <DialogTitle className='text-2xl'>
                        Record Audio
                    </DialogTitle>
                    <DialogDescription className='text-sm text-xw-muted'>
                        Make sure your recording has range in voice and tone, no background noise, and is up to 5 minutes.
                    </DialogDescription>
                </DialogHeader>

                <XWGradSeparator />

                <div className='text-center text-sm text-xw-muted'>
                    Start recording by tapping on the button below. Your recording will show up here.
                </div>

                <XWGradSeparator />

                <div>

                    {/* <AudioBox /> */}
                </div>

                <XWGradSeparator />

                <div className='flex items-center justify-center gap-2'>
                    {!isRecording ? (
                        <button
                            onClick={startRecording}
                            className='h-8 w-8 bg-xw-danger rounded-full ring-1 ring-offset-2 ring-offset-transparent hover:scale-105 hover:ring-2 transition-all duration-200'
                        />
                    ) : (
                        <div className='h-8 w-fit bg-gradient-to-r from-white/20 via-white/10 to-transparent rounded-full p-[1px]'>
                            <div className='flex items-center gap-2 bg-xw-sidebar rounded-full h-full w-full px-3'>
                                <div className='text-sm'>
                                    {formatTime(recordingTime)}
                                </div>
                                <button
                                    onClick={stopRecording}
                                    className='rounded-full h-6 w-6 flex items-center justify-center bg-white hover:bg-white/90 transition-colors'
                                >
                                    <span className='h-3 w-3 bg-xw-danger rounded-sm'></span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default RecordVoceFlow
