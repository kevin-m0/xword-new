import React from 'react'
import SocialPostPreviewComponent from './SocialPostPreviewComponent'

const SocialFlowContent = ({ postImage, postContent }: { postImage: string, postContent: string }) => {
    return (
        <div className='flex-1 flex items-center justify-center p-4'>
            <SocialPostPreviewComponent
                postImage={postImage}
                postContent={postContent}
            />          
        </div>
    )
}

export default SocialFlowContent
