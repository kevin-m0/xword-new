import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetTitle } from "~/components/ui/sheet";
import { Card, CardHeader } from "~/components/ui/card";
import { trpc } from "~/trpc/react";
import { useXWAlert } from "~/components/reusable/xw-alert";

const CollabVersionComponent = (
    { documentId, revert }: { documentId: string, revert?: (version: number, versionData: any) => Promise<void> }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
    const { showToast } = useXWAlert();
    const [isReverting, setIsReverting] = useState(false);

    const utils = trpc.useUtils();

    // TRPC Mutations and Queries
    const createVersionMutation = trpc.editor.createVersion.useMutation({
        onSuccess: () => {
            showToast({
                title: "Version created successfully",
                variant: "success",
                message: "Version created successfully",
            });
            utils.editor.getAllVersions.invalidate({ id: documentId });
        },
        onError: (error) => {
            showToast({
                title: error.message,
                variant: "error",
                message: error.message,
            });
        },
    });

    const getAllVersionsQuery = trpc.editor.getAllVersions.useQuery({ id: documentId });

    const deleteVersionMutation = trpc.editor.deleteVersion.useMutation({
        onSuccess: () => {
            showToast({
                title: "Version deleted successfully",
                variant: "success",
                message: "Version deleted successfully",
            });
            utils.editor.getAllVersions.invalidate({ id: documentId });
        },
        onError: (error) => {
            showToast({
                title: error.message,
                variant: "error",
                message: error.message,
            });
        },
    });

    // Automatically select the latest version when versions are loaded
    useEffect(() => {
        if (getAllVersionsQuery.data?.length) {
            const sortedVersions = [...getAllVersionsQuery.data].sort(
                (a, b) => b.version - a.version // Assuming `version` is a number
            );
            setSelectedVersionId(sortedVersions[0]?.id || null); // Select latest version
        }
    }, [getAllVersionsQuery.data]);

    // Preview version content
    const handlePreviewVersion = (versionId: string) => {
        setSelectedVersionId(versionId);
        // Fetch or display the selected version's content here
        console.log(`Previewing version: ${versionId}`);
    };

    const handleRevert = async (version: number, versionData: any) => {
        // console.log("Reverting version:", version, versionData);
        setIsReverting(true);
        try {
            await revert?.(version, versionData);
            utils.editor.getAllVersions.invalidate({ id: documentId });
            // setIsSheetOpen(false);
        } catch (error) {
            showToast({
                title: "Error",
                variant: "error",
                message: "Failed to revert version"
            });
        } finally {
            setIsReverting(false);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-2">
                {/* Create Version Button */}
                <Button
                    variant="default"
                    onClick={() => createVersionMutation.mutate({ id: documentId })}
                    disabled={createVersionMutation.isPending}
                >
                    {createVersionMutation.isPending ? "Creating..." : "Create Version"}
                </Button>

                {/* Sheet Trigger */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline">Manage Versions</Button>
                    </SheetTrigger>

                    <SheetContent className="max-w-sm w-full overflow-y-auto xw-scrollbar">
                        <SheetHeader>
                            <SheetTitle>Versions</SheetTitle>
                        </SheetHeader>

                        <div className="mt-4 space-y-4">
                            {getAllVersionsQuery.isLoading ? (
                                <p>Loading...</p>
                            ) : getAllVersionsQuery.data?.length ? (
                                [...getAllVersionsQuery.data]
                                    .sort((a, b) => b.version - a.version) // Sort by version descending
                                    .map((version: any) => (
                                        <Card key={version.version} >
                                            <CardHeader>
                                                <span>{version.name || `Version ${version.version}`}</span>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant={"outline"}
                                                        onClick={() => handleRevert(version.version, version)}
                                                    // disabled={isReverting || version.version === currentVersion}
                                                    >
                                                        {isReverting ? "Reverting..." : "Revert"}
                                                    </Button>

                                                    <Button
                                                        variant="destructive"
                                                        onClick={() =>
                                                            deleteVersionMutation.mutate({
                                                                id: documentId,
                                                                versionId: version.version,
                                                            })
                                                        }
                                                        disabled={deleteVersionMutation.isPending}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    ))
                            ) : (
                                <p>No versions available</p>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
};

export default CollabVersionComponent;
