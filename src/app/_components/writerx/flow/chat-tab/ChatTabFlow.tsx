import React from 'react'
import WriterXChatComponent from './WriterXChatComponent'

const ChatTabFlow = ({ id, content }: { id: string, content: string }) => {
    return (
        <WriterXChatComponent id={id} content={content} />
    )
}

export default ChatTabFlow
