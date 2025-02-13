import Image from 'next/image'
import React from 'react'

interface props {
    title?: string;
    description?: string;
    action?: React.ReactNode
}
const EmptyScreen = ({ title, description, action }: props) => {
    return (
        <div className=' p-5 flex flex-col items-center justify-center gap-8 h-[800px] w-full'>
            <div>
                <Image
                    src={"/images/empty.png"}
                    height={100}
                    width={100}
                    alt='empty'
                    sizes='100vh'
                    className=' h-full w-full object-contain'
                />
            </div>
            <div className=' max-w-3xl w-full text-center'>

                <h1 className=' text-center text-3xl font-semibold'>
                    {title}
                </h1>

                <p className='mt-4 text-center text-xw-muted tb:text-lg max-w-3xl mx-auto'>
                    {description}
                </p>
            </div>
            {action}
        </div>
    )
}

export default EmptyScreen
