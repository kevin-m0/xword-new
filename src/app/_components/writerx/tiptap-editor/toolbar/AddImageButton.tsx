

import { Button } from '~/components/ui/button'
import React from 'react'
import { BiImage } from 'react-icons/bi'
import { ImageSelector } from '../../../newflow/flow/support/ImageSelector/ImageSelector'
import { Editor } from '@tiptap/react'

const AddImageButton = ({ editor }: { editor: Editor }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    const handleSelectedImages = (images: string[]) => {
        console.log(images)
        setIsOpen(false)
        editor.chain().focus().setImage({ src: images[0] as string }).run();
    }
    return (
        <>
            <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => setIsOpen(!isOpen)}
            >
                <BiImage className="h-4 w-4" />
            </Button>

            <ImageSelector
                open={isOpen}
                onOpenChange={setIsOpen}
                single={true}
                onImagesSelected={handleSelectedImages}
            />
        </>
    )
}

export default AddImageButton
