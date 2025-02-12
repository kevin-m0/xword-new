import React from 'react'
import Image from 'next/image'
import XWSecondaryButton from '../reusable/XWSecondaryButton'
import { ChevronRight } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import XWCheckbox from '../reusable/xw-checkbox'


const ChatSonicScrapeData = () => {
    return (
        <div className=' flex flex-col gap-5'>
            <h1 className='text-lg text-xw-muted'>
                a short article about the early days of Google
            </h1>

            <h1 className=' mt-5 text-2xl font-semibold'>
                Sources
            </h1>

            <div className=' grid grid-cols-1 tb:grid-cols-2 gap-5'>
                <div className=' bg-gradient-to-r from-white/10 via-white/30 to-white/40 rounded-lg p-[0.8px] h-fit'>
                    <div className=' xw-premium-div rounded-lg flex items-center gap-2 p-2 h-full w-full'>
                        <div className=' rounded-full overflow-hidden'>
                            <Image
                                src={"/images/action3.png"}
                                height={40}
                                width={40}
                                alt='action'
                            />
                        </div>
                        <div>
                            <p className=' text-sm text-xw-muted'>https://en.wikipedia.org/wiki/Hi...</p>
                            <h1 className=' text-lg font-semibold text-xw-primary'>
                                History of Google - Wikipedia
                            </h1>
                        </div>
                    </div>
                </div>

                <div className=' bg-gradient-to-r from-white/10 via-white/30 to-white/40 rounded-lg p-[0.8px] h-fit'>
                    <div className=' xw-premium-div rounded-lg flex items-center gap-2 p-2 h-full w-full'>
                        <div className=' rounded-full overflow-hidden'>
                            <Image
                                src={"/images/action3.png"}
                                height={40}
                                width={40}
                                alt='action'
                            />
                        </div>
                        <div>
                            <p className=' text-sm text-xw-muted'>https://en.wikipedia.org/wiki/Hi...</p>
                            <h1 className=' text-lg font-semibold text-xw-primary'>
                                History of Google - Wikipedia
                            </h1>
                        </div>
                    </div>
                </div>


                <div className=' bg-gradient-to-r from-white/10 via-white/30 to-white/40 rounded-lg p-[0.8px] h-fit'>
                    <div className=' xw-premium-div rounded-lg flex items-center gap-2 p-2 h-full w-full'>
                        <div className=' rounded-full overflow-hidden'>
                            <Image
                                src={"/images/action3.png"}
                                height={40}
                                width={40}
                                alt='action'
                            />
                        </div>
                        <div>
                            <p className=' text-sm text-xw-muted'>https://en.wikipedia.org/wiki/Hi...</p>
                            <h1 className=' text-lg font-semibold text-xw-primary'>
                                History of Google - Wikipedia
                            </h1>
                        </div>
                    </div>
                </div>

                <div className=' bg-gradient-to-r h-full from-white/10 via-white/30 to-white/40 rounded-lg p-[0.8px]'>
                    <div className=' xw-premium-div rounded-lg flex items-center gap-2 p-2 h-full w-full'>
                        <div className='flex items-center -space-x-4'>
                            <div className=' rounded-full overflow-hidden'>
                                <Image
                                    src={"/images/action3.png"}
                                    height={40}
                                    width={40}
                                    alt='action'
                                />
                            </div>
                            <div className=' rounded-full overflow-hidden'>
                                <Image
                                    src={"/images/action3.png"}
                                    height={40}
                                    width={40}
                                    alt='action'
                                />
                            </div>
                            <div className=' rounded-full overflow-hidden'>
                                <Image
                                    src={"/images/action3.png"}
                                    height={40}
                                    width={40}
                                    alt='action'
                                />
                            </div>
                        </div>
                        <div className=' ml-auto mr-0'>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <XWSecondaryButton size='sm' className1=' ml-auto mr-0'>
                                        View 6 more <ChevronRight className=' h-4 w-4 ml-2' />
                                    </XWSecondaryButton>
                                </SheetTrigger>
                                <SheetContent className=' max-w-sm w-full px-0 flex flex-col'>
                                    <SheetHeader>
                                        <SheetTitle className=' px-5 text-left'>
                                            4 Sources
                                        </SheetTitle>
                                        <SheetDescription className=' hidden'>
                                            This action cannot be undone. This will permanently delete your account
                                            and remove your data from our servers.
                                        </SheetDescription>
                                    </SheetHeader>


                                    <ScrollArea>
                                        <div className=' flex flex-col gap-4 mt-5 p-5'>

                                            {Array.from({ length: 9 }).map((_, index) => (
                                                <div key={index} className=' flex items-center gap-2'>

                                                    <div>
                                                        <XWCheckbox />
                                                    </div>

                                                    <div className=' bg-gradient-to-r from-white/10 via-white/30 to-white/40 rounded-lg p-[0.8px] h-fit'>
                                                        <div className=' xw-premium-div rounded-lg flex items-center gap-2 p-2 h-full w-full'>
                                                            <div className=' rounded-full overflow-hidden'>
                                                                <Image
                                                                    src={"/images/action3.png"}
                                                                    height={40}
                                                                    width={40}
                                                                    alt='action'
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className=' text-sm text-xw-muted'>https://en.wikipedia.org/wiki/Hi...</p>
                                                                <h1 className=' text-lg font-semibold text-xw-primary'>
                                                                    History of Google - Wikipedia
                                                                </h1>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <ScrollBar />
                                        </div>

                                    </ScrollArea>

                                    <Separator />

                                    <div className=' mb-0 px-5 mt-auto flex items-center justify-end'>

                                        <XWSecondaryButton className1=' w-fit' size='sm'>
                                            Remove Sources
                                        </XWSecondaryButton>
                                    </div>

                                </SheetContent>
                            </Sheet>

                        </div>

                    </div>
                </div>


            </div>

            <div className=' flex flex-col gap-2'>
                <h1 className=' text-2xl font-semibold'>Answer</h1>
                <h1 className='text-lg'>
                    Origins at Stanford University
                </h1>
                <p className=' text-xw-muted'>
                    In 1995, Larry Page and Sergey Brin,
                    two PhD students at Stanford University, first met and began discussing
                    their shared interests in technology and information retrieval.
                    By 1996, they had developed a search engine prototype called Backrub,
                    which utilized backlinks to assess the importance of web pages.
                    This innovative approach laid the groundwork for what would become Google
                </p>

                <h1 className='text-lg'>
                    The Birth of Google Inc.
                </h1>
                <p className=' text-xw-muted'>
                    The transition from Backrub to Google occurred in 1997 when Page and Brin registered
                    the domain google.com, a name derived from the mathematical term googol,
                    representing the number 1 followed by 100 zeros. This choice reflected
                    their mission to organize vast amounts of information on the internet.
                    The official incorporation of Google Inc. took place on September 4, 1998,
                    following a pivotal $100,000 investment from Andy Bechtolsheim, co-founder of
                    Sun Microsystems
                </p>
            </div>
        </div>
    )
}

export default ChatSonicScrapeData
