'use client'

import React, { createContext, useContext, useState } from 'react'

type PreviewType = 'facebook' | 'instagram' | 'twitter' | 'linkedin'

interface SocialPreviewContextType {
    postText: string
    setPostText: (text: string) => void
    selectedPreview: PreviewType
    setSelectedPreview: (type: PreviewType) => void
    images: string[]
    setImages: (images: string[]) => void
}

const SocialPreviewContext = createContext<SocialPreviewContextType | undefined>(undefined)

export const SocialPreviewProvider = ({ children }: { children: React.ReactNode }) => {
    const [postText, setPostText] = useState(`There's something magical about watching the sun sink behind the mountains, painting the sky with shades of pink, orange, and gold. These moments remind me of how beautiful the world can be when we just stop and take it all in. ✨`)
    const [selectedPreview, setSelectedPreview] = useState<PreviewType>('linkedin')
    const [images, setImages] = useState<string[]>([
        '/images/user2.png',
        '/images/user2.png',
        '/images/user2.png'
    ])

    return (
        <SocialPreviewContext.Provider value={{
            postText,
            setPostText,
            selectedPreview,
            setSelectedPreview,
            images,
            setImages
        }}>
            {children}
        </SocialPreviewContext.Provider>
    )
}

export const useSocialPreview = () => {
    const context = useContext(SocialPreviewContext)
    if (!context) throw new Error('useSocialPreview must be used within SocialPreviewProvider')
    return context
}
