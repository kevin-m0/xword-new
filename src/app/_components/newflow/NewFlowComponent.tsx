import React from 'react'
import FlowDialog from './flow/FlowDialog'
import MultiCampaignDialog from './multi-campaign/MultiCampaignDialog'

const NewFlowComponent = () => {
    return (
        <div className=' w-full p-5'>
            <div className='flex items-center gap-2 justify-between w-full'>
                <h1 className=' text-3xl font-bold'>New Flow</h1>
                <div className='flex items-center gap-2'>
                    {/* <FlowDialog /> */}
                    {/* <MultiCampaignDialog /> */}
                </div>
            </div>
        </div>
    )
}

export default NewFlowComponent
