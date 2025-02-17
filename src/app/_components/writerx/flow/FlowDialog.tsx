'use client';
import React from 'react'
import { useAtom } from 'jotai'

import NewFlowManagerComponent from './NewFlowManagerComponent'
import { Dialog, DialogContent, DialogTrigger } from '~/components/reusable/xw-dialog';
import { flowSteps } from '~/atoms/writerXAtoms';

const FlowDialog = ({ children }: { children: React.ReactNode }) => {
    const [step, setStep] = useAtom(flowSteps);
    
    return (
        <Dialog>
            <DialogTrigger onClick={() => setStep(0)} asChild>
                {children}
            </DialogTrigger>
            <DialogContent className=' max-w-6xl h-[700px] overflow-y-auto xw-scrollbar w-full bg-xw-sidebar rounded-xl p-0'>
                <NewFlowManagerComponent />
            </DialogContent>
        </Dialog>
    )
}

export default FlowDialog