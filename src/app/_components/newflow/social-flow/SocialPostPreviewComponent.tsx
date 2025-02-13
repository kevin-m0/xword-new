'use client'

import React, { useState } from 'react'
import { useAtomValue } from 'jotai'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react'
import Image from 'next/image'
import { postImageAtom, postTextAtom } from '../../../_atoms/socialAtom'
import { useUser } from '@clerk/nextjs'

const SocialPostPreviewComponent = ({ postImage, postContent }: { postImage: string, postContent: string }) => {
    const user = useUser()
    const [isExpanded, setIsExpanded] = useState(false)

    const toggleExpand = () => setIsExpanded(!isExpanded)

    const renderPostContent = () => {
        if (!postContent) {
            return <p className="text-sm text-xw-muted">No Preview Available</p>
        }

        if (postContent.length <= 200) {
            return (
                <p className="text-sm text-gray-800">
                    <span className="font-semibold mr-2">johndoe</span>
                    {postContent}
                </p>
            )
        }

        return (
            <p className="text-sm text-gray-800">
                <span className="font-semibold mr-2">johndoe</span>
                {isExpanded ? postContent.slice(0, 200) : `${postContent.slice(0, 100)}... `}
                <button
                    onClick={toggleExpand}
                    className="text-xs text-xw-primary underline ml-1"
                >
                    {isExpanded ? 'Show less' : 'Show more'}
                </button>
            </p>
        )
    }

    return (
        <Card className="max-w-[470px] w-full bg-white hover:bg-white">
            {/* Header */}
            <CardHeader className="flex flex-row items-center space-x-4 p-4">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                        {user.user?.firstName || 'John Doe'}
                    </p>
                    <p className="text-xs text-gray-500">New York, USA</p>
                </div>
                <Button variant="ghost" size="icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-more-horizontal"
                    >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                    </svg>
                </Button>
            </CardHeader>

            {/* Content */}
            <CardContent className="p-0">
                {postImage ? (
                    <div className="aspect-square w-full relative">
                        <Image
                            src={postImage}
                            alt="Post image"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                ) : (
                    <div className="aspect-square w-full flex items-center justify-center bg-gray-100">
                        <p className="text-sm text-xw-muted">No Preview Available</p>
                    </div>
                )}
            </CardContent>

            {/* Footer */}
            <CardFooter className="flex flex-col items-start p-4">
                {/* Actions */}
                <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon">
                            <Heart className="h-6 w-6" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <MessageCircle className="h-6 w-6" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Send className="h-6 w-6" />
                        </Button>
                    </div>
                    <Button variant="ghost" size="icon">
                        <Bookmark className="h-6 w-6" />
                    </Button>
                </div>

                <p className="text-sm font-semibold mb-1 text-gray-500">1,234 likes</p>

                {/* Post Text */}
                {renderPostContent()}

                <p className="text-xs text-gray-500 mt-1">View all 100 comments</p>
                <p className="text-xs text-gray-500 mt-1">2 HOURS AGO</p>
            </CardFooter>
        </Card>
    )
}

export default SocialPostPreviewComponent
