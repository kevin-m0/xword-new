"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { Loader2 } from "lucide-react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { trpc } from "~/trpc/react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "~/components/reusable/xw-dialog";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { Button } from "~/components/ui/button";
import { XWInput } from "~/components/reusable/XWInput";
import TopBarComponent from "../topbar/TopbarComponent";
import WriterXBannerComponent from "./WriterXBannerComponent";




const WriterXMainComponent: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { organization: defaultSpace } = useOrganization();
    const { showToast } = useXWAlert();
    const {user} = useUser();
    const utils = trpc.useUtils();
    const router = useRouter();

    console.log("user----------------------->", user);
    

    const { data: docs = [], isPending: isDocsLoading } = trpc.writerx.getAllDocs.useQuery({
        workspaceId: defaultSpace?.id as string,
    });

    console.log("docs--------------------------->", docs);
    
    const { mutate: createDocument, isPending: isCreating } = trpc.writerx.createDocument.useMutation({
        onSuccess(newDoc) {
            utils.writerx.getAllDocs.invalidate();
            showToast({
                title: "Success",
                message: "Document created successfully",
                variant: "success",
            });
            router.push(`/writerx/${newDoc.id}`);
        },
        onError(error) {
            showToast({
                title: "Error",
                message: error.message,
                variant: "error",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim()) {
            showToast({
                title: "Validation Error",
                message: "Title cannot be empty",
                variant: "error",
            });
            return;
        }
        createDocument({ workspaceId: defaultSpace?.id as string, title });
        setTitle("");
    };

    const handleOpenChange = (open: boolean) => {
        setIsModalOpen(open);
        if (!open) {
            setTitle("");
        }
    };

    return (
        <div className="flex flex-col gap-5 h-dvh w-full">
            <TopBarComponent />

            <div className="px-5">
                <WriterXBannerComponent />
            </div>

            <div className="flex items-center gap-5 justify-between px-5">
                <h1 className="text-2xl font-semibold">Documents</h1>

                <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button variant="default" disabled={isCreating}>
                            {isCreating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Create New
                        </Button>
                    </DialogTrigger>

                    <DialogContent maxWidth="sm">
                        <DialogHeader>
                            <DialogTitle className="text-start mb-2">
                                Create New Document
                            </DialogTitle>
                            <DialogDescription className="text-start mb-2">
                                Please enter a title for your new document.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <XWInput
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Enter document title"
                            />
                            <div className="flex justify-start space-x-2">
                                <Button
                                    type="reset"
                                    variant="secondary"
                                    onClick={() => {
                                        setTitle("");
                                        setIsModalOpen(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="default" disabled={isCreating}>
                                    {isCreating ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        "Create"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* <div className="grid grid-cols-3 gap-5 px-5">
                {!isDocsLoading && docs.length > 0 ? (
                    docs.map((doc) => (
                        <Card key={doc.id}>
                            <CardHeader>
                                <CardTitle>
                                    <Link
                                        href={`/${doc.redirectType === "General" ? "writerx" : "social"}/${doc.id}`}
                                        className="hover:underline"
                                    >
                                        {doc.title}
                                    </Link>
                                </CardTitle>
                                <CardDescription>
                                    {moment(doc.createdAt).format("DD-MM-YYYY")}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))
                ) : isDocsLoading ? (
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : null}
            </div>

            {!isDocsLoading && docs.length === 0 && (
                <EmptyScreen
                    title="No documents found"
                    description="Create a new document to get started"
                />
            )} */}
        </div>
    );
};

export default WriterXMainComponent;
