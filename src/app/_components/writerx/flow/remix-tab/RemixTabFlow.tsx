'use client'

import React, { useState } from 'react'
import WriterXRemixComponent from './WriterXRemixComponent'
import WXRemixTabUpload from './WXRemixTabUpload'

type TabType = 'all' | 'url' | 'upload'

const RemixTabFlow = () => {
    const [activeTab, setActiveTab] = useState<TabType>('all')

    const renderContent = () => {
        switch (activeTab) {
            case 'all':
                return <WriterXRemixComponent />
            case 'url':
                return <WriterXRemixComponent />
            case 'upload':
                return <WXRemixTabUpload />
            default:
                return <WriterXRemixComponent />
        }
    }

    return (
        <div className=' flex-1 flex flex-col gap-5'>
            <div>
                <h1>Content to Remix</h1>

                <div className=' flex items-center gap-2 mt-5'>
                    <div className={` rounded-full bg-gradient-to-tr ${activeTab === 'all' ? 'from-white/40 via-white/60 to-white/90' : 'from-white/10 via-white/30 to-white/40'} p-[0.5px]`}>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={` ${activeTab === 'all' ? 'bg-xw-primary' : 'bg-xw-sidebar'} px-3 py-1 text-sm rounded-full`}
                        >
                            All
                        </button>
                    </div>

                    <div className={` rounded-full bg-gradient-to-tr ${activeTab === 'url' ? 'from-white/40 via-white/60 to-white/90' : 'from-white/10 via-white/30 to-white/40'} p-[0.5px]`}>
                        <button
                            onClick={() => setActiveTab('url')}
                            className={` ${activeTab === 'url' ? 'bg-xw-primary' : 'bg-xw-sidebar'} px-3 py-1 text-sm rounded-full`}
                        >
                            Url
                        </button>
                    </div>

                    <div className={` rounded-full bg-gradient-to-tr ${activeTab === 'upload' ? 'from-white/40 via-white/60 to-white/90' : 'from-white/10 via-white/30 to-white/40'} p-[0.5px]`}>
                        <button
                            onClick={() => setActiveTab('upload')}
                            className={` ${activeTab === 'upload' ? 'bg-xw-primary' : 'bg-xw-sidebar'} px-3 py-1 text-sm rounded-full`}
                        >
                            Upload File
                        </button>
                    </div>
                </div>
            </div>

            {renderContent()}
        </div>
    )
}

export default RemixTabFlow
