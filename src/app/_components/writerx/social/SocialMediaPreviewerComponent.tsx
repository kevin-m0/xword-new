'use client'
import React from 'react'
import SocialMediaPreviewerSidebar from './SocialMediaPreviewerSidebar'
import SocialMediaPreviewer from './SocialMediaPreviewer'
import { SocialPreviewProvider } from '~/app/_context/social-preview-provider'
// import { SocialPreviewProvider } from '../../../_context/social-preview-provider'

const SocialMediaPreviewerComponent = () => {
    return (
        <SocialPreviewProvider>
            <div className='flex h-full w-full'>
                <SocialMediaPreviewerSidebar />
                <div className='flex-1'>
                    <SocialMediaPreviewer />
                </div>
            </div>
        </SocialPreviewProvider>
    )
}

export default SocialMediaPreviewerComponent
