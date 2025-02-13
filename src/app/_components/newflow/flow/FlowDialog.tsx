'use client';
import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from '../../reusable/xw-dialog'

import NewFlowManagerComponent from './NewFlowManagerComponent'
import { Button } from '@/components/ui/button'
import { useAtom } from 'jotai'
import { flowSteps } from '../../../_atoms/flowAtom'

const FlowDialog = ({ children }: { children: React.ReactNode }) => {
    const [step, setStep] = useAtom(flowSteps)
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