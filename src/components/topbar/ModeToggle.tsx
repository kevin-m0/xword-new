"use client";
import Image from 'next/image'
import React, { useState } from 'react'

const ModeToggle = () => {
    const [activeMode, setActiveMode] = useState<1 | 2>(1)

    return (
        <div className='p-[1px] rounded-full bg-gradient-to-r from-white/30 via-white/70 to-white'>
            <div className='xw-topbar-toggle bg-zinc-400/90 rounded-full p-1 gap-1 flex items-center'>
                <div className={`rounded-full p-[1px] ${activeMode === 1 ? 'bg-gradient-to-tr from-zinc-300 to-zinc-100' : ''}`}>
                    <button
                        onClick={() => setActiveMode(1)}
                        className={`xw-topbar-toggle-button flex items-center p-1 rounded-full ${activeMode === 1 ? 'bg-white/20 backdrop-blur-sm' : ''}`}
                    >
                        <Image
                            src={activeMode === 1 ? "/icons/mode-1-active.svg" : "/icons/mode-1.svg"}
                            height={15}
                            width={15}
                            alt='mode-1'
                        />
                    </button>
                </div>

                <div className={`rounded-full p-[1px] ${activeMode === 2 ? 'bg-gradient-to-tr from-zinc-300 to-zinc-100' : ''}`}>
                    <button
                        onClick={() => setActiveMode(2)}
                        className={`xw-topbar-toggle-button flex items-center p-1 rounded-full ${activeMode === 2 ? 'bg-white/20 backdrop-blur-sm' : ''}`}
                    >
                        <Image
                            src={activeMode === 2 ? "/icons/mode-2-active.svg" : "/icons/mode-2.svg"}
                            height={15}
                            width={15}
                            alt='mode-2'
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModeToggle
