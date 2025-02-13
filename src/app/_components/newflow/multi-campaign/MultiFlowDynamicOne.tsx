import { useAtom } from 'jotai';
import React from 'react'
import { multiFlowStep, multiSourceSelect } from '../../../_atoms/multiFlow';
import FlowContentSelectionTwo from './FlowContentSelectionTwo';
import MultiFlowDynamicSelection from './MultiFlowDynamicSelection';

const MultiFlowDynamicOne = () => {
    return (
        <div className='  max-w-4xl w-full mx-auto p-5 space-y-6'>
            <MultiFlowDynamicSelection />
        </div>
    )
}

export default MultiFlowDynamicOne
