import React from 'react'
import { Separator } from '~/components/ui/separator'
import { Button } from '~/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useWriterXContext } from '~/app/_context/writerX-context'
import ChatTabFlow from './flow/chat-tab/ChatTabFlow'

const WriterXSidebar = ({ id, content }: { id: string, content: string }) => {
    const { setIsOpen } = useWriterXContext()


    const handleClose = () => {
        setIsOpen(false)
    }

    const tabs = [
        {
            id: 'create',
            label: 'Create',
            icon: '/icons/magic.svg'
        },
        {
            id: 'remix',
            label: 'Remix',
            icon: '/icons/repeat.svg'
        },
        {
            id: 'chat',
            label: 'Chat',
            icon: '/icons/chatoval.svg'
        }
    ]

    return (
        <div className='h-full  bg-xw-sidebar border-r border-xw-border  w-full flex flex-col gap-5 overflow-hidden'>
            <div className='flex px-5 pt-5 items-center justify-between'>
                <div className='flex items-center gap-2'>


                    <h1 className='text-2xl font-semibold'>
                        Magic AI
                    </h1>
                </div>

                <div className='hidden tb:block'>
                    <Button variant={"outline"} size='icon' onClick={handleClose}>
                        <ChevronLeft className='h-4 w-4' />
                    </Button>
                </div>
            </div>

            <Separator />
            <div className=' px-5 pb-5 flex-1 h-full flex flex-col gap-5 overflow-y-auto xw-scrollbar  '>
                <ChatTabFlow id={id} content={content} />
            </div>
        </div>
    )
}

export default WriterXSidebar
