import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { Button } from '~/components/ui/button'
// import { contentType } from '../../../../_lib/contentverse'
import WXGenerateContentForm from './WXGenerateContentForm'
import XWBadge from '~/components/reusable/XWBadge'
import { contentType } from '~/lib/contentVerse'
// import XWBadge from '../../../reusable/XWBadge'

interface WriterXCreateComponentProps {
    onCategorySelect: () => void;
}

const WriterXCreateComponent: React.FC<WriterXCreateComponentProps> = ({ onCategorySelect }) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const totalSlides = 4

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    }

    return (
        <div className='flex flex-col gap-8'>
            <WXGenerateContentForm />

            {/* Featured */}
            <div className='flex flex-col gap-5'>
                <div className='flex items-center justify-between'>
                    <h1>Feature</h1>

                    <div className='flex items-center rounded-full border border-xw-secondary w-fit overflow-hidden'>
                        <button
                            onClick={prevSlide}
                            className='py-2 px-3 hover:bg-xw-secondary transition-colors'
                        >
                            <ArrowLeft className='h-4 w-4' />
                        </button>
                        <button
                            onClick={nextSlide}
                            className='p-2 px-3 border-l border-xw-secondary hover:bg-xw-secondary transition-colors'
                        >
                            <ArrowRight className='h-4 w-4' />
                        </button>
                    </div>
                </div>

                <div className='flex items-center gap-5 overflow-hidden'>
                    <div
                        className='flex transition-transform duration-300 ease-in-out'
                        style={{ transform: `translateX(-${currentSlide * 384}px)` }}
                    >
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className='w-96 mr-2 rounded-lg overflow-hidden xw-gradient-primary-border flex-shrink-0'>
                                <div className='w-full rounded-lg p-5 flex flex-col gap-2 bg-xw-card'>
                                    <h1>Anecdote, Relevant Lesson & Significance</h1>

                                    <div className='flex items-center justify-between'>
                                        <XWBadge>
                                            Youtube Script
                                        </XWBadge>
                                        <Button variant={"secondary"} className='gap-2'>
                                            Draft
                                            <Image
                                                src={"/icons/pen.svg"}
                                                alt='pen'
                                                width={15}
                                                height={15}
                                            />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2 justify-between'>
                        <h1>Categories</h1>

                        <Button
                            size={"sm"}
                            variant={"link"}
                            onClick={onCategorySelect}
                        >
                            View All <ChevronRight className='h-4 w-4 ml-2' />
                        </Button>
                    </div>

                    <div className='grid grid-cols-2 gap-2'>
                        {contentType.map((item, index) => (
                            <div
                                key={index}
                                className='p-[0.8px] rounded-sm bg-gradient-to-tr from-white/10 via-white/30 to-white/40'
                                onClick={onCategorySelect}
                                role="button"
                                tabIndex={0}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className='bg-xw-card cursor-pointer hover:bg-xw-card-hover text-sm bg-opacity-80 rounded-sm py-2 px-3 flex items-center justify-between gap-2'>
                                    <h1>{item}</h1>
                                    <p>2</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WriterXCreateComponent
