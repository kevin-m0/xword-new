'use client'
import React, { useState } from 'react'
import WXSelectTemplate from './WXSelectTemplate'
import { Separator } from '~/components/ui/separator'
import WriterXCreateComponent from './WriterXCreateComponent'
import WXCreateFlowOne from './WXCreateFlowOne'
import WXCreateTabFlowTwo from './WXCreateTabFlowTwo'
import WXCreateTabFlowThree from './WXCreateTabFlowThree'
import { ArrowLeft, Check, ChevronRight } from 'lucide-react'
import { PurposeFormValues, TitleFormValues, OutlineFormValues } from '~/lib/schemas/writer-flow-schemas'
import XWSecondaryButton from '~/components/reusable/XWSecondaryButton'

type FlowState = 'categories' | 'templates' | 'flow'

const CreateTabFlow = () => {
    const [flowState, setFlowState] = useState<FlowState>('categories')
    const [currentStep, setCurrentStep] = useState(1)
    const [completedSteps, setCompletedSteps] = useState<number[]>([])
    const [formData, setFormData] = useState({
        purpose: {} as PurposeFormValues,
        title: {} as TitleFormValues,
        outline: {} as OutlineFormValues,
    })

    const handleBack = () => {
        if (flowState === 'flow') {
            setFlowState('templates')
        } else if (flowState === 'templates') {
            setFlowState('categories')
        }
    }

    const handleTemplateSelect = () => {
        setFlowState('flow')
    }

    const handleCategorySelect = () => {
        setFlowState('templates')
    }

    const handlePurposeSubmit = (data: PurposeFormValues) => {
        setFormData(prev => ({ ...prev, purpose: data }))
        setCurrentStep(2)
        setCompletedSteps(prev => Array.from(new Set([...prev, 1])))
    }

    const handleTitleSubmit = (data: TitleFormValues) => {
        setFormData(prev => ({ ...prev, title: data }))
        setCurrentStep(3)
        setCompletedSteps(prev => Array.from(new Set([...prev, 2])))
    }

    const handleOutlineSubmit = (data: OutlineFormValues) => {
        setFormData(prev => ({ ...prev, outline: data }))
        setCurrentStep(4)
        setCompletedSteps(prev => Array.from(new Set([...prev, 3])))
    }

    if (flowState === 'categories') {
        return (
            <div className='flex flex-col gap-5'>
                <WriterXCreateComponent onCategorySelect={handleCategorySelect} />
            </div>
        )
    }

    if (flowState === 'templates') {
        return <WXSelectTemplate onBack={handleBack} onTemplateSelect={handleTemplateSelect} />
    }

    return (
        <div className='flex flex-col gap-5'>
            <CreateTabFlowSteps
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                completedSteps={completedSteps}
                setCompletedSteps={setCompletedSteps}
                onBack={handleBack}
            />
        </div>
    )
}

interface CreateTabFlowStepsProps {
    currentStep: number
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>
    completedSteps: number[]
    setCompletedSteps: React.Dispatch<React.SetStateAction<number[]>>
    onBack: () => void
}

const CreateTabFlowSteps = ({
    currentStep,
    setCurrentStep,
    completedSteps,
    setCompletedSteps,
    onBack
}: CreateTabFlowStepsProps) => {
    const flowSteps = [
        "Purpose",
        "Title",
        "Outline",
        "Generate"
    ]

    const handleStepClick = (stepNumber: number) => {
        if (completedSteps.includes(stepNumber) || stepNumber === currentStep + 1 || stepNumber === currentStep) {
            if (stepNumber < currentStep) {
                setCompletedSteps((prev: number[]) => prev.filter((step: number) => step < stepNumber))
            } else if (stepNumber > currentStep) {
                setCompletedSteps((prev: number[]) => Array.from(new Set([...prev, currentStep])))
            }
            setCurrentStep(stepNumber)
        }
    }

    const handlePurposeSubmit = (data: PurposeFormValues) => {
        setCompletedSteps(prev => Array.from(new Set([...prev, 1])))
        setCurrentStep(2)
    }

    const handleTitleSubmit = (data: TitleFormValues) => {
        setCompletedSteps(prev => Array.from(new Set([...prev, 2])))
        setCurrentStep(3)
    }

    const handleOutlineSubmit = (data: OutlineFormValues) => {
        setCompletedSteps(prev => Array.from(new Set([...prev, 3])))
        setCurrentStep(4)
    }

    const handleStepBack = () => {
        setCurrentStep(prev => Math.max(1, prev - 1))
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <WXCreateFlowOne onNext={handlePurposeSubmit} />
            case 2:
                return (
                    <WXCreateTabFlowTwo
                        onNext={handleTitleSubmit}
                        onBack={handleStepBack}
                    />
                )
            case 3:
                return (
                    <WXCreateTabFlowThree
                        onNext={handleOutlineSubmit}
                        onBack={handleStepBack}
                    />
                )
            case 4:
                return <div>Review & Edit Step</div>
            default:
                return <WXCreateFlowOne onNext={handlePurposeSubmit} />
        }
    }

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex items-center gap-4'>
                <div>
                    <XWSecondaryButton rounded='full' size='icon' onClick={onBack}>
                        <ArrowLeft className='h-6 w-6' />
                    </XWSecondaryButton>
                </div>
                <h1 className='text-2xl font-bold'>Blog Post</h1>
            </div>

            <div className='flex items-center flex-wrap gap-3'>
                {flowSteps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = completedSteps.includes(stepNumber);
                    const isCurrent = stepNumber === currentStep;
                    const isClickable = isCompleted || stepNumber === currentStep || stepNumber === currentStep + 1;

                    return (
                        <div
                            key={index}
                            className={`flex items-center gap-2 ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                            onClick={() => isClickable && handleStepClick(stepNumber)}
                        >
                            <div
                                className={`rounded-full h-6 w-6 flex items-center justify-center transition-colors duration-200 ${isCompleted ? 'bg-green-500' :
                                    isCurrent ? 'bg-xw-primary' :
                                        'bg-xw-background border text-xw-muted border-xw-secondary'
                                    }`}
                            >
                                {isCompleted ? (
                                    <Check className='h-4 w-4 text-white' />
                                ) : (
                                    stepNumber
                                )}
                            </div>
                            <h1 className={`transition-colors text-sm duration-200 ${!isCurrent && !isCompleted ? 'text-xw-muted' : ''}`}>
                                {step}
                            </h1>
                            {index !== flowSteps.length - 1 && (
                                <ChevronRight className={`h-4 w-4 transition-colors duration-200 ${!isCurrent && !isCompleted ? 'text-xw-muted' : ''}`} />
                            )}
                        </div>
                    )
                })}
            </div>

            <Separator />

            {renderStep()}
        </div>
    )
}

export default CreateTabFlow
