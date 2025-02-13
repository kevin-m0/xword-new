'use client';
import React, { useEffect } from 'react'
import SocialFlowContent from './SocialFlowContent'
import SocialFlowSidebar from './SocialFlowSidebar'
import SocialMobileSidebar from './SocialMobileSidebar'
import { useAtom } from 'jotai';
import { postImageAtom, postTextAtom } from '../../../_atoms/socialAtom';
import { flowImages, flowVariations, socialFlowId } from '../../../_atoms/flowAtom';

const SocialFlowDesign = ({ doc, loading }: { doc: any, loading: boolean }) => {
    const [postText, setPostText] = useAtom(postTextAtom)
    const [postImage, setPostImage] = useAtom(postImageAtom)
    const [flowId, setFlowId] = useAtom(socialFlowId)
    const [images, setImages] = useAtom(flowImages);

    console.log(doc);
    setPostText(doc?.content || "")
    setPostImage(doc?.thumbnailImageUrl || "")
    setFlowId(doc?.id || "")
    setImages(doc?.images || [])

    return (
        <div className="h-dvh overflow-hidden flex flex-col tb:flex-row">
            <div className='tb:hidden p-3 flex items-center gap-2 justify-between'>
                <h1 className="text-2xl font-semibold">Edit</h1>
                <SocialMobileSidebar variations={doc?.variations} />
            </div>
            <div className='hidden tb:block max-w-lg w-full bg-xw-sidebar border-r border-xw-border'>
                <SocialFlowSidebar variations={doc?.variations} />
            </div>
            <SocialFlowContent postImage={doc.thumbnailImageUrl} postContent={doc.content} />
        </div>
    )
}

export default SocialFlowDesign
