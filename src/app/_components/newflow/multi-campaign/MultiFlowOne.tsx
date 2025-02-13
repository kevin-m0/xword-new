'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { multiFlowStep, MultiSelectType, multiSourceSelect } from '../../../_atoms/multiFlow';
import FlowContentSelection from './FlowContentSelection';
import SourceSelectionComponent from './SourceSelectionComponent';
import FlowContentSelectionTwo from './FlowContentSelectionTwo';
import XWBadge from '../../reusable/XWBadge';
import { ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const MultiFlowOne = () => {
    const [step, setStep] = useAtom(multiFlowStep);
    const [sourceType, setSourceType] = useAtom(multiSourceSelect);

    return (
        <div className=' max-w-4xl w-full mx-auto p-5 space-y-6'>

            <SourceSelectionComponent />

            <div>
                {sourceType !== MultiSelectType.default &&
                    <div className=' space-y-6'>
                        <Separator />
                        <FlowContentSelectionTwo />
                    </div>
                }
            </div>
        </div>
    );
};

export default MultiFlowOne;