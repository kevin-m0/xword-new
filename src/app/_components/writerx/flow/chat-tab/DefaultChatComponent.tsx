// import { selectedSuggestionAtom } from "@/app/(site)/(dashboard)/_atoms/writerXAtoms"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import { useAtom } from "jotai"
import Image from "next/image"
import { selectedSuggestionAtom } from "~/atoms/writerXAtoms"

export const DefaultChatComponent = ({
    suggestedPrompts,
    loading,
    name
}: {
    suggestedPrompts: string[],
    loading: boolean,
    name: string
}) => (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
        <Image src="/icons/chatmagic.svg" height={30} width={30} alt="chat" />
        <div className="text-center">
            <h1 className="text-3xl font-medium capitalize">
                Hello, <span className="text-xw-primary">{name}</span>
            </h1>
            <p className="mt-2 text-xw-muted-foreground">How can I help you today?</p>
        </div>
        <SuggestedPrompts prompts={suggestedPrompts} loading={loading} />
    </div>
)

const SuggestedPrompts = ({
    prompts,
    loading,
}: {
    prompts: string[]
    loading: boolean
}) => {
    const [prompt, setPrompt] = useAtom(selectedSuggestionAtom)
    return (
        <div className="w-full text-center">
            {prompts && prompts.length > 0 && <h2 className="text-sm font-medium text-xw-muted-foreground mb-2">Suggested Prompts</h2>}
            {loading ? (
                <div className="grid grid-cols-2 gap-2 w-full">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <Skeleton
                            className='h-9 rounded-full text-sm w-full'
                            key={i}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-wrap justify-center gap-2">
                    {prompts.map((prompt, i) => (
                        <div
                            key={i}
                            className='rounded-full w-fit p-2 px-3 bg-xw-secondary hover:bg-xw-secondary-hover cursor-pointer text-left text-xs'
                            onClick={() => setPrompt(prompt)}
                        >
                            {prompt}
                        </div>
                    ))}
                    {/* <Button variant="xw_ghost" className="h-9 rounded-full text-sm">
                        <BookOpen className="h-4 w-4 mr-2" /> See prompt library
                    </Button> */}
                </div>
            )}
        </div>
    )
}