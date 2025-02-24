import { Copy, RefreshCcw, Send, Volume2Icon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import moment from 'moment'

export const MessageBubble = ({ message, role, createdAt, image, name }: { role: string, message: string, createdAt: Date, image: string, name: string }) => {
    return (
        <div className="flex gap-3">
            <Avatar>
                <AvatarImage
                    src={role === 'user' ? image : "/icons/chatsonic-fake.svg"}
                />
                <AvatarFallback>{role === 'user' ? name.slice(0, 2) : 'AI'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <h3>{role === 'user' ? 'You' : 'Assistant'}</h3>
                    <span className="text-xs text-xw-muted">{moment(createdAt).fromNow()}</span>
                </div>
                <p className="text-xw-muted-foreground">{message}</p>
                {role === 'assistant' && (
                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                            <Volume2Icon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                            <RefreshCcw className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}