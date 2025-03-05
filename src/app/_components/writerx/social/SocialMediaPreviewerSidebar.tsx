import React from 'react'
// import XWSecondaryButton from '../../reusable/XWSecondaryButton'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { Separator } from '~/components/ui/separator'
// import { XWTextarea } from '../../reusable/XWTextarea'
import { Button } from '~/components/ui/button'
import Image from 'next/image'
import { Tooltip } from '~/components/ui/tooltip'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import { BiImageAdd } from 'react-icons/bi'
// import XWPrimaryDiv from '../../reusable/XWPrimaryDiv'
import { useSocialPreview } from '../../../_context/social-preview-provider'
import XWSecondaryButton from '~/components/reusable/XWSecondaryButton'
import { XWTextarea } from '~/components/reusable/XWTextarea'
import XWPrimaryDiv from '~/components/reusable/XWPrimaryDiv'
import ImportFromAssetsModel from '../../assets/ImportFromAssetsModel'
// import ImportFromAssetsModel from '../../assets/ImportFromAssetsModel'

const SocialMediaPreviewerSidebar = () => {
    const { postText, setPostText, images, setImages } = useSocialPreview()

    return (
        <div className=' max-w-lg w-full bg-xw-sidebar p-5 border-r border-xw-secondary flex flex-col gap-5' >

            <div className='flex items-center gap-2'>
                <div>
                    <XWSecondaryButton size='icon' rounded='full'>
                        <ArrowLeft className=' h-4 w-4' />
                    </XWSecondaryButton>
                </div>
                <h1>
                    Post Previewer
                </h1>

            </div>

            <Separator />


            <div className='w-full flex flex-col gap-2'>
                <h1>Enter Post Text</h1>
                <div className='relative'>
                    <XWTextarea
                        className='min-h-[400px] pb-10'
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                    />

                    <div className='absolute bottom-2 left-2 right-2'>
                        <div className='flex items-center gap-2 justify-between'>
                            <Button size={"icon"} variant={"ghost"}>
                                <Image
                                    src={"/icons/add-emoji.svg"}
                                    height={15}
                                    width={15}
                                    alt='add emoji'
                                />
                            </Button>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size={"icon"} className=' h-9 w-9 rounded-full'>
                                            <Image
                                                src={"/icons/ideabulb.svg"}
                                                alt='idea bulb'
                                                width={20}
                                                height={20}
                                            />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className=' p-2 bg-white text-xw-secondary text-sm max-w-xs mx-2'>
                                        <p>
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            <div>
                <div className=' flex items-center justify-between gap-2'>
                    <h1>Images</h1>

                    <XWSecondaryButton>
                        <BiImageAdd className=' h-4 w-4 ' />
                        Add Images
                    </XWSecondaryButton>
                </div>

                <div className='mt-5 w-full grid grid-cols-4 gap-2'>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className='relative rounded-lg overflow-hidden group aspect-square'>
                            <Image
                                src={"/images/user10.png"}
                                fill
                                alt='image'
                                className="object-cover"
                            />

                            <div className='absolute bg-black/20 top-0 left-0 h-full w-full p-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                                <div className='flex items-center gap-1 justify-end flex-wrap'>
                                    <Button
                                        size={"sm"}
                                        variant={"ghost"}
                                        className="bg-xw-sidebar"
                                    >
                                        <Image
                                            src={"/icons/edit-pen.svg"}
                                            height={15}
                                            width={15}
                                            alt='edit'
                                            className="opacity-100"
                                        />
                                    </Button>
                                    <Button
                                        size={"sm"}
                                        variant={"ghost"}
                                        className="bg-xw-sidebar"
                                    >
                                        <Image
                                            src={"/icons/trashbin.svg"}
                                            height={15}
                                            width={15}
                                            alt='delete'
                                            className="opacity-100"
                                        />
                                    </Button>
                                    <Button
                                        size={"sm"}
                                        variant={"ghost"}
                                        className="bg-xw-sidebar"
                                    >
                                        <Image
                                            src={"/icons/expand-arrow.svg"}
                                            height={15}
                                            width={15}
                                            alt='expand'
                                            className="opacity-100"
                                        />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <ImportFromAssetsModel>
                        <XWPrimaryDiv className="relative rounded-lg overflow-hidden transition-colors cursor-pointer group aspect-square">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-2">
                                    <Plus className='w-12 h-12 text-white group-hover:text-gray-200' />
                                </div>
                            </div>
                        </XWPrimaryDiv>
                    </ImportFromAssetsModel>


                </div>
            </div>

            <div className=' flex items-center justify-end p-5 mt-auto mb-0'>
                <Button variant={"default"} className=' h-9 rounded-lg'>
                    Schedule Content <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
            </div>
        </div>
    )
}

export default SocialMediaPreviewerSidebar
