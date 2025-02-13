'use client';
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../../reusable/xw-dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAtom } from 'jotai'
import { multiFlowStep, MultiSelectType, multiSourceSelect } from '../../../_atoms/multiFlow'
import MultiFlowOne from './MultiFlowOne'
import MultiFlowTwo from './MultiFlowTwo';
import MultiFlowThree from './MultiFlowThree';
import XWBadge from '../../reusable/XWBadge'
import { ChevronRight } from 'lucide-react';

const MultiCampaignDialog = ({ children }: { children: React.ReactNode }) => {
    const [step, setStep] = useAtom(multiFlowStep);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [source, setSource] = useAtom(multiSourceSelect);

    const handleBack = () => {
        if (step === 2) {
            setStep(1);
        }
    }

    const handleOpen = () => {
        setDialogOpen(true);
        setStep(0);
        setSource(MultiSelectType.default);
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger onClick={handleOpen} asChild>
                {children}
            </DialogTrigger>

            <DialogContent className='max-w-6xl w-full p-0 rounded-2xl overflow-hidden h-[700px] flex flex-col bg-xw-sidebar '>
                <div className='flex items-center gap-2 p-5 '>
                    <div className='flex items-center gap-4 p-2 rounded-lg hover:bg-xw-secondary cursor-pointer' onClick={() => setStep(0)}>
                        <XWBadge className={`h-8 w-8 rounded-full ${step === 0 ? "bg-xw-primary" : "bg-xw-primary-disabled"} `}>
                            1
                        </XWBadge>
                        <div>
                            <h1 className='font-semibold'>
                                Select Source
                            </h1>
                        </div>
                    </div>

                    <div>
                        <ChevronRight className='h-6 w-6' />
                    </div>

                    <div className='flex items-center gap-2 p-2 rounded-lg hover:bg-xw-secondary cursor-pointer' onClick={handleBack}>
                        <XWBadge className={`h-8 w-8 rounded-full ${step === 1 ? "bg-xw-primary" : "bg-xw-primary-disabled"} `}>
                            2
                        </XWBadge>
                        <div>
                            <h1 className='font-semibold'>
                                Provide Context
                            </h1>

                        </div>
                    </div>

                    <div>
                        <ChevronRight className='h-6 w-6' />
                    </div>

                    <div className='flex items-center gap-2 p-2 rounded-lg'>
                        <XWBadge className={`h-8 w-8 rounded-full ${step === 2 ? "bg-xw-primary" : "bg-xw-primary-disabled"} `}>
                            3
                        </XWBadge>
                        <div>
                            <h1 className='font-semibold'>
                                Generate Content
                            </h1>

                        </div>
                    </div>
                </div>
                <div className='flex-1 p-5 pb-10 overflow-y-auto xw-scrollbar'>
                    {step === 0 ?
                        <MultiFlowOne />
                        :
                        step === 1 ?
                            <MultiFlowTwo />
                            :
                            step === 2 ?
                                <MultiFlowThree closeDialog={() => setDialogOpen(false)} />
                                :
                                <></>
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MultiCampaignDialog