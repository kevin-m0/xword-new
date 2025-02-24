import React, { useState, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/reusable/xw-dialog';
import { X } from 'lucide-react';
import { useXWAlert } from '~/components/reusable/xw-alert';

interface NewLinkPopoverModelProps {
    editor: any; // The editor prop (Tiptap editor instance)
}

const NewLinkPopoverModel: React.FC<NewLinkPopoverModelProps> = ({ editor }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [link, setLink] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [isLinkActive, setIsLinkActive] = useState(false);
    const { showToast } = useXWAlert();

    useEffect(() => {
        // Fetch selected text from editor when selection changes
        const updateSelectedText = () => {
            const { from, to } = editor.state.selection;
            if (from !== to) {  // If there is a selection
                const text = editor.state.doc.textBetween(from, to, ' ');
                setSelectedText(text);

                // Check if the selected text already has a link
                const mark = editor.getAttributes('link');
                if (mark.href) {
                    setLink(mark.href);
                    setIsLinkActive(true); // Link is active if it exists
                } else {
                    setLink(''); // Clear link if no active link
                    setIsLinkActive(false);
                }

            } else {
                setSelectedText('');
                setLink('');
                setIsLinkActive(false); // No selection means no active link
            }
        };

        // Listen for selection changes in the editor
        editor.on('selectionUpdate', updateSelectedText);

        // Clean up the event listener when the component is unmounted
        return () => {
            editor.off('selectionUpdate', updateSelectedText);
        };
    }, [editor]);

    // Apply the link to the selected text
    const handleAddLink = () => {
        if (selectedText && link) {
            // Insert or update the link on the selected text
            editor.chain().focus().extendMarkRange('link').setLink({ href: link }).run();
            showToast({
                title: isLinkActive ? 'Link Updated' : 'Link Added',
                message: 'Link has been added to the selected text.',
                variant: 'success',
            });
        }
    };

    const handleRemoveLink = () => {
        if (isLinkActive) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            showToast({
                title: 'Link Removed',
                message: 'The link has been removed from the selected text.',
                variant: 'success',
            });
            // Clear state after removing the link
            setLink('');
            setIsLinkActive(false);
        }
    };

    return (
        <div>
            {/* Button to open the popover */}
            <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
                <DialogTrigger asChild>
                    <Button size="icon" variant={isLinkActive ? "secondary" : "ghost"}>
                        <Image
                            src="/icons/editor/link.svg"
                            height={16}
                            width={16}
                            alt="link"
                        />
                    </Button>
                </DialogTrigger>
                <DialogContent className="p-2 border-none shadow-lg rounded-lg bg-xw-sidebar max-w-md w-full z-[9999]">
                    <DialogHeader>
                        <DialogTitle className='mb-2'>
                            {isLinkActive ? 'Update Link' : 'Add Link'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className='flex items-center gap-2'>
                        {/* Input for link URL */}
                        <Input
                            type="url"
                            placeholder="Enter link"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="flex-1"
                        />
                        {/* Add button */}
                        <Button
                            onClick={() => {
                                handleAddLink();
                                // Close the dialog after adding/updating the link
                            }}
                            disabled={!link || !selectedText}
                            variant={"default"}
                        >
                            {isLinkActive ? 'Update' : 'Add'}
                        </Button>
                        {isLinkActive && (
                            <Button
                                onClick={handleRemoveLink}
                                variant={"destructive"} // Use a danger variant for removal
                                className=""
                                size="icon"
                            >
                                <X className='h-4 w-4' />
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NewLinkPopoverModel;
