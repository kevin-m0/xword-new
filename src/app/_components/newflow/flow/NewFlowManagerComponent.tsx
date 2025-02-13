'use client'
import React from 'react'
import SelectTemplateComponent from './template/SelectTemplateComponent'
import { useAtom } from 'jotai'
import { flowPrevType, flowPromptId, flowSteps } from '../../../_atoms/flowAtom'
import { ChevronRight } from 'lucide-react'
import ContentPurposeFlow from './handler/purpose/ContentPurposeFlow'
import XWBadge from '../../reusable/XWBadge'

const NewFlowManagerComponent = () => {
    const [step, setStep] = useAtom(flowSteps)
    const [flowPrompt, setFlowPromptId] = useAtom(flowPromptId)
    const [prev, setPrev] = useAtom(flowPrevType);

    return (
        <div >

            <div className='flex items-center gap-2 p-5 '>
                <div className='flex items-center gap-4 p-2 rounded-lg hover:bg-xw-secondary cursor-pointer' onClick={() => setStep(0)}>
                    <XWBadge className={`h-8 w-8 rounded-full ${step === 0 ? "bg-xw-primary" : "bg-xw-primary-disabled"} `}>
                        1
                    </XWBadge>
                    <div>
                        <h1 className='font-semibold'>
                            Select Template
                        </h1>
                    </div>
                </div>

                <div>
                    <ChevronRight className='h-6 w-6' />
                </div>

                <div className='flex items-center gap-2 p-2 rounded-lg'>
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


            {step === 0 &&
                <SelectTemplateComponent usecase='Content' />
            }


            {(step === 1 || step === 2) && flowPrompt && (
                <div className=' max-w-4xl mx-auto w-full p-5 pb-10'>
                    <ContentPurposeFlow
                        prev={prev || ""}
                        inputType="text"
                        promptId={flowPrompt}
                        step={Number(step)}
                        setStep={setStep}
                    />
                </div>
            )}
        </div>
    )
}

export default NewFlowManagerComponent