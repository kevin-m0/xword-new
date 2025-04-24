import React from 'react'
import NotificationBar from './NotificationBar'
import UserBox from './UserBox'

const AITopBarComponent = () => {
    return (
        <div className=' p-3 w-full flex items-center gap-2'>

            <div className=' mr-0 ml-auto flex items-center gap-2'>
                <NotificationBar />
                <UserBox />
            </div>
        </div>
    )
}

export default AITopBarComponent
