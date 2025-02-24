import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Editor } from '@tiptap/react'
import Image from 'next/image'
import React from 'react'
import NewEditorHeader from './NewEditorHeader'
// import { XWDropdown, XWDropdownContent, XWDropdownItem, XWDropdownTrigger } from '../../../reusable/xw-dropdown'
import { Bold, ChevronDown, Code, Italic, Moon, StrikethroughIcon, Sun, Underline } from 'lucide-react'
import NewLinkPopoverModel from './NewLinkPopoverModel'
import NewEditorMulticolorHighlight from './NewEditorMulticolorHighlight'
import NewEditorTextColor from './NewEditorTextColor'
import NewEditorImageUploadAndGenerateComponent from './NewEditorImageUploadAndGenerateComponent'
// import { useXWAlert } from '../../../reusable/xw-alert'
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area'
import NewBubbleTextListPopover from './NewBubbleTextListPopover'
import { useXWAlert } from '~/components/reusable/xw-alert'

interface Props {
    editor: Editor,
    title: string,
    id: string,
    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>,
    docId: string
    revert?: (version: number, versionData: any) => Promise<void>
}
const NewEditorToolBar = ({ editor, title, id, theme, setTheme, docId, revert }: Props) => {
    const { showToast } = useXWAlert();


    return (
        <div className="px-5 py-2 border-b border-xw-border flex flex-col items-center">
            <NewEditorHeader
                title={title}
                id={id}
                content={editor.getText()}
                editor={editor}
            />
            <ScrollArea className=' w-full '>
                <div className='flex items-center  gap-2 min-w-6xl w-full py-3'>
                    <Button variant="outline" className='gap-2' onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                        {theme === "light" ? (
                            <Sun className='h-4 w-4' />
                        ) : (
                            <Moon className='h-4 w-4' />
                        )}
                        {theme === "light" ? "Dark" : "Light"}
                    </Button>
                    {/* Undo */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editor.chain().focus().undo().run()}
                    >
                        <Image
                            src="/icons/editor/rotate-left.svg"
                            height={16}
                            width={16}
                            alt="rotate-left"
                        />
                    </Button>

                    {/* Redo */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editor.chain().focus().redo().run()}
                    >
                        <Image
                            src="/icons/editor/rotate-right.svg"
                            height={16}
                            width={16}
                            alt="rotate-right"
                        />
                    </Button>
                    <NewBubbleTextListPopover editor={editor} />

                    <NewEditorMulticolorHighlight editor={editor} />

                    <NewEditorTextColor editor={editor} />


                    <Separator orientation="vertical" />

                    {/* Text Formatting */}
                    <Button
                        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                        <Bold className='h-4 w-4' />
                    </Button>

                    <Button
                        variant={editor.isActive('italic') ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                    >
                        <Italic className='h-4 w-4' />
                    </Button>

                    <Button
                        variant={editor.isActive('underline') ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                    >
                        <Underline className='h-4 w-4' />
                    </Button>

                    <Button
                        variant={editor.isActive('strike') ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                    >
                        <StrikethroughIcon className='h-4 w-4' />
                    </Button>

                    <Button
                        variant={editor.isActive('code') ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    >
                        <Code className='h-4 w-4' />
                    </Button>


                    <NewLinkPopoverModel
                        editor={editor}
                    />
                    <NewEditorImageUploadAndGenerateComponent
                        editor={editor}
                    />



                    <ScrollBar orientation='horizontal' />
                </div>

            </ScrollArea>
        </div>
    )
}

export default NewEditorToolBar
