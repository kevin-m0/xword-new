'use client'
import React, { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
// import { useWriterXContext } from '@/app/(site)/(dashboard)/_context/writerx-context';
// import WriterXSidebar from '../../WriterXSidebar';
// import { useXWAlert } from '../../../reusable/xw-alert';
// import WriterXSocialPreviewMenu from '../../social/WriterXSocialPreviewMenu';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Button } from '~/components/ui/button';
import { Editor } from '@tiptap/core';
import { ChevronRight, Share } from 'lucide-react';
import { useOrganization, useOrganizationList } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { trpc } from '~/trpc/react';
import { useWriterXContext } from '~/app/_context/writerX-context';
import { useXWAlert } from '~/components/reusable/xw-alert';
import WriterXSidebar from '../../WriterXSidebar';
import WriterXSocialPreviewMenu from '../../social/WriterXSocialPreviewMenu';

const NewEditorHeader = ({ title, content, id, editor }: { title: string, id: string, content: string, editor: Editor }) => {
    const { isOpen, setIsOpen } = useWriterXContext();
    const { showToast } = useXWAlert();
    const [newTitle, setNewTitle] = useState(title || "");
    const utils = trpc.useUtils();
    const { memberships } = useOrganization({
        memberships: {
            pageSize: 4
        }
    });

    const { mutate: updateTitle } = trpc.writerx.changeDocTitle.useMutation({
        onSuccess: () => {
            utils.writerx.getAllDocs.invalidate();
            utils.writerx.getSingleDoc.invalidate();
            showToast({
                title: "Success!",
                message: "Title updated successfully",
                variant: "success",
            });
        },
        onError: () => {
            showToast({
                title: "Error!",
                message: "Failed to update title",
                variant: "error",
            });
        },
    });

    const handleOpen = () => {
        setIsOpen(true);
    };


    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.target.value);
    }

    const handleTitleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newTitle.length > 40) {
            showToast({
                title: "Error!",
                message: "Title must be less than 40 characters",
                variant: "error",
            });
            return;
        }

        if (newTitle.trim().length < 3) {
            showToast({
                title: "Error!",
                message: "Title must be at least 3 characters",
                variant: "error",
            });
            return;
        }

        try {
            updateTitle({
                title: newTitle || "",
                docId: id
            })
        }
        catch (e) {
            console.log(e);
        }

    }


    const exportContent = async (type: 'pdf' | 'word') => {
        try {
            const endpoint = type === 'pdf' ? '/api/export-pdf' : '/api/export-word';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ htmlContent: editor.getHTML() }),
            });

            if (!response.ok) throw new Error(`Failed to generate ${type.toUpperCase()}`);

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `document.${type}`;
            link.click();
        } catch (error) {
            console.error(`Error exporting to ${type.toUpperCase()}:`, error);
            showToast({
                title: "Error",
                message: `Error exporting to ${type.toUpperCase()}`,
                variant: "error",
            });
        }
    };

    return (
        <div className="w-full flex items-center justify-between gap-2">

            <div className=" flex items-center gap-5 flex-1">
                {!isOpen && (
                    <div className="hidden tb:block">
                        <Button variant={"outline"} size="icon" onClick={handleOpen}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <div className="tb:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant={"outline"} size="icon" onClick={handleOpen}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 bg-xw-sidebar px-0 pr-0">
                            <WriterXSidebar
                                id={id}
                                content={content}
                            />
                        </SheetContent>
                    </Sheet>
                </div>

                <form className='flex-1' onSubmit={handleTitleSubmit}>
                    <input
                        className="border-none outline-none bg-transparent rounded-lg border-b border-xw-primary max-w-sm w-full focus:outline-none focus:outline-b-2  focus:ring-1 focus:ring-xw-primary "
                        type="text"
                        value={newTitle}
                        onChange={handleTitleChange}
                        placeholder="Document Title"
                    />
                </form>
            </div>



            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                    >
                        Export <Share className="h-4 w-4 ml-2" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className=' flex flex-col gap-1 border-none'>
                    <Button variant="ghost" onClick={() => exportContent('pdf')}>
                        Export to PDF
                    </Button>
                    <Button variant="ghost" onClick={() => exportContent('word')}>
                        Export to Word
                    </Button>
                </PopoverContent>
            </Popover>

            <div className='flex items-center -space-x-2'>
                {memberships?.data?.map((member) => (
                    <Avatar key={member.publicUserData.userId} className='h-8 w-8 border border-xw-border'>
                        <AvatarImage src={member.publicUserData.imageUrl} alt={member.publicUserData.userId} />
                        <AvatarFallback>{member.publicUserData.firstName?.slice(0, 1) || "U"}</AvatarFallback>
                    </Avatar>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <WriterXSocialPreviewMenu />
            </div>
        </div>
    )
}

export default NewEditorHeader
