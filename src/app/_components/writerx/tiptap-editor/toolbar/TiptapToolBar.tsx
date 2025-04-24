"use client"

import { Editor } from '@tiptap/core'
import React from 'react'
import { Button } from '~/components/ui/button'
import { Bold, ChevronDown, Code, Italic, Minus, Moon, RemoveFormatting, StrikethroughIcon, Sun, Underline } from 'lucide-react'
import Image from 'next/image'
import HighlightColorOptions from './HighlightColorOptions'
import TextFormateMenu from './TextFormateMenu'
import TextColorOptions from './TextColorOptions'
import TextAlignmentMenu from './TextAlignmentMenu'
import AddImageButton from './AddImageButton'
import AddLinkButton from './AddLinkButton'
const TiptapToolBar = ({ editor }: { editor: Editor }) => {

    return (
        <div>

            <div className='flex gap-2'>
                <div>
                    {/* <Button variant="outline" className='gap-2' onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                        {theme === "light" ? (
                            <Sun className='h-4 w-4' />
                        ) : (
                            <Moon className='h-4 w-4' />
                        )}
                        {theme === "light" ? "Dark" : "Light"}
                    </Button> */}
                </div>
                <div>
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
                </div>
                <div>
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
                </div>
                <div>
                    <TextFormateMenu editor={editor} />
                </div>
                <div>
                    <HighlightColorOptions editor={editor} />
                </div>
                <div>
                    <TextAlignmentMenu editor={editor} />
                </div>
                <div>
                    <TextColorOptions editor={editor} />
                </div>
                <div>
                    <Button
                        variant={editor?.isActive('bold') ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    >
                        <Bold className='h-4 w-4' />
                    </Button>
                </div>
                <div>
                    <Button
                        variant={editor?.isActive('italic') ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                    >
                        <Italic className='h-4 w-4' />
                    </Button>
                </div>
                <div>
                    <Button
                        variant={editor?.isActive('underline') ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                    >
                        <Underline className='h-4 w-4' />
                    </Button>
                </div>
                <div>
                    <Button
                        variant={editor?.isActive('strike') ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                    >
                        <StrikethroughIcon className='h-4 w-4' />
                    </Button>
                </div>
                <div>
                    <Button
                        variant={editor?.isActive('code') ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    >
                        <Code className='h-4 w-4' />
                    </Button>
                </div>
                <div>
                    <Button
                        variant={editor?.isActive('code') ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    >
                        <Minus className='h-4 w-4' />
                    </Button>
                </div>
                <div>
                    <Button
                        variant={editor?.isActive('code') ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
                    >
                        <RemoveFormatting className='h-4 w-4' />
                    </Button>
                </div>
                <div>
                    <AddLinkButton editor={editor} />
                </div>
                <div>
                    <AddImageButton editor={editor} />
                </div>
            </div>

        </div>
    )
}

export default TiptapToolBar

