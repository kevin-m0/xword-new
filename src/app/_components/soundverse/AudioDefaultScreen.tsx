import Link from 'next/link'
import React from 'react'

const AudioDefaultScreen = () => {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="max-w-sm text-center">
                <h1 className="text-xw-muted">
                    Your Generations will appear here <br />
                    and be saved to
                    <Link href={"/media"}>
                        <span className="ml-1 text-xw-primary">Media.</span>
                    </Link>
                </h1>
            </div>
        </div>
    )
}

export default AudioDefaultScreen
