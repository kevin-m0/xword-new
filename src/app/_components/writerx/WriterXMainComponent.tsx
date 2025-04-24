"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { Calendar, Clock, EllipsisVertical, Loader2, Trash2 } from "lucide-react";
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
import WriterXBannerComponent from "./WriterXBannerComponent";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import EmptyScreen from "../empty/EmptyScreen";
import SearchBarComponent from "../topbar/SearchBarComponent";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "~/components/ui/alert-dialog";

const WriterXMainComponent: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { organization: defaultSpace } = useOrganization();
    const { showToast } = useXWAlert();
    const { user } = useUser();
    const utils = trpc.useUtils();
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [openAlert, setOpenAlert] = useState(false);


    const workspaceId = defaultSpace?.id || "";
    const { data: docs = [], isPending: isDocsLoading } = trpc.writerx.getAllDocs.useQuery(
        { workspaceId },
        { enabled: !!workspaceId }
    );

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

    const { mutate: deleteDocument, isPending: isDeleting } = trpc.writerx.deleteDocument.useMutation({
        onSuccess: () => {
            setOpenAlert(false);
            utils.writerx.getAllDocs.invalidate(); // Refetch the documents after deletion
        },
        onError: (error) => {
            alert(error.message); // Show error message
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

    // Filter documents based on search query
    const filteredDocs = docs.filter((doc) =>
        doc.title.toLowerCase().includes(search.toLowerCase())
    );

   

    const handleDeleteDoc = async (docId: string) => {
        deleteDocument({ id: docId });
    };


    return (
        <div className="gap-4 flex flex-col h-dvh w-full">

            <div className="px-5">
                <WriterXBannerComponent />
            </div>

            <div className="flex items-center gap-5 justify-between px-5">
                <div>
                    <h1 className="text-2xl font-semibold">Documents</h1>
                </div>
                <div className="gap-4 flex">
                    {/* SearchBarComponent now properly updates search state */}
                    <SearchBarComponent handleSearch={(value: string) => setSearch(value)} />

                    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                            <Button className="h-10" variant="default" disabled={isCreating}>
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

            </div>

            {/* Display Filtered Docs */}
            <div className="grid grid-cols-3 gap-5 px-5">
                {!isDocsLoading && filteredDocs.length > 0 ? (
                    filteredDocs.map((doc) => (
                        <Card key={doc.id} className="p-2 border border-gray-200 shadow-sm transition hover:shadow-md rounded-xl">
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex justify-between items-center">
                                        <Link
                                            href={`/${doc.redirectType === "General" ? "writerx" : "social"}/${doc.id}`}
                                            className="text-lg font-semibold hover:underline transition"
                                        >
                                            {doc.title}
                                        </Link>
                                        <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="hover:border-2" onClick={() => setOpenAlert(true)}>
                                                    <Trash2 className="h-6 w-6" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={() => setOpenAlert(false)}>Cancel</AlertDialogCancel>
                                                    <Button
                                                        onClick={() => handleDeleteDoc(doc.id)}
                                                        disabled={isDeleting}
                                                        variant="default"
                                                        className="hover:border-2 hover:bg-red-700 bg-red-500 text-white"
                                                    >
                                                        {isDeleting ? <Loader2 className="animate-spin" /> : "Continue"}
                                                    </Button>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>

                                    </div>
                                </CardTitle>

                                <CardDescription className="mt-2">
                                    <div className="mb-2">
                                        <p className="text-sm">
                                            <span className="font-medium">Type:</span> {doc.redirectType}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-medium">{moment(doc.createdAt).format("DD MMMM YYYY")}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span className="font-medium">{moment(doc.createdAt).format("hh:mm A")}</span>
                                        </div>
                                    </div>
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))
                ) : isDocsLoading ? (
                    <div className="flex items-center justify-center w-full col-span-3 h-40">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : null}
            </div>

            {!isDocsLoading && filteredDocs.length === 0 && (
                <EmptyScreen
                    title="No documents found"
                    description="Create a new document to get started"
                />
            )}
        </div>
    );
};

export default WriterXMainComponent;


