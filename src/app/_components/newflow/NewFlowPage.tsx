"use client";
import { trpc } from "@/app/_trpc/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LayoutGrid, List, Loader2, Trash2 } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React from "react";
import TopbarComponent from "../../_components/topbar/TopbarComponent";
import EmptyScreen from "../../_components/empty/EmptyScreen";
import NewFlowBanner from "./NewFlowBanner";
import { Button } from "~/components/ui/button";
import NewFlowTableView from "./NewFlowTableView";
import Image from "next/image";
import NewFlowBannerTwo from "./NewFlowBannerTwo";
import {
  XWDropdown,
  XWDropdownContent,
  XWDropdownItem,
  XWDropdownTrigger,
} from "../reusable/xw-dropdown";
import { FaEllipsis, FaPencil } from "react-icons/fa6";
import { useOrganization } from "@clerk/nextjs";
const NewFlowPage = () => {
  const { organization: defaultSpace } = useOrganization();

  const [tableView, setTableView] = React.useState(false);

  const { data: docs = [], isLoading: isDocsLoading } =
    trpc.writerx.getAllDocs.useQuery({
      workspaceId: defaultSpace?.id as string,
    });

  return (
    <div className="flex min-h-dvh w-full flex-col gap-5">
      <TopbarComponent />

      <div className="tb:px-10 px-5">
        <NewFlowBanner />
        {/* <NewFlowBannerTwo /> */}
      </div>
      <div className="tb:p-10 p-5">
        <div className="w-full py-5">
          <div className="flex w-full items-center justify-between gap-2">
            <h1 className="text-3xl font-bold">Recents</h1>
            <div className="flex items-center gap-2">
              <Button
                variant={tableView ? "xw_ghost" : "primary"}
                size={"icon"}
                onClick={() => setTableView(false)}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>

              <Button
                variant={tableView ? "primary" : "xw_ghost"}
                size={"icon"}
                onClick={() => setTableView(true)}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        {!tableView ? (
          <div className="grid grid-cols-5 gap-5">
            {!isDocsLoading && docs.length > 0 ? (
              docs.map((doc) => (
                <Card
                  key={doc.id}
                  className="overflow-hidden border-none bg-transparent hover:bg-transparent"
                >
                  <div className="bg-xw-sidebar-two group relative overflow-hidden rounded-lg p-6">
                    <div className="overflow-hidden">
                      <Image
                        src={doc.thumbnailImageUrl!}
                        alt={doc.title}
                        sizes="100vh"
                        height={100}
                        width={100}
                        className="aspect-video h-full w-full rounded-md object-cover object-left-top"
                      />
                    </div>

                    <div className="absolute left-0 top-0 h-full w-full bg-black/20 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="xw_secondary">
                          <FaPencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="xw_secondary">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="mt-2 px-2">
                    <div className="flex flex-1 flex-col">
                      <CardTitle className="text-lg">
                        <Link
                          href={`/${doc.redirectType === "General" ? "writerx" : "social"}/${doc.id}`}
                          className="hover:underline"
                        >
                          {doc.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Last Edited:{" "}
                        {moment(doc.updatedAt).format("DD-MM-YYYY")}
                      </CardDescription>
                    </div>

                    {/* <div>
                                            <XWDropdown>
                                                <XWDropdownTrigger asChild>
                                                    <Button variant={"xw_ghost"} size={"icon"}>
                                                        <FaEllipsis className="h-4 w-4" />
                                                    </Button>
                                                </XWDropdownTrigger>
                                                <XWDropdownContent>
                                                    <XWDropdownItem>
                                                        View
                                                    </XWDropdownItem>
                                                    <XWDropdownItem>
                                                        Delete
                                                    </XWDropdownItem>
                                                </XWDropdownContent>
                                            </XWDropdown>
                                        </div> */}
                  </CardContent>
                </Card>
              ))
            ) : isDocsLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <NewFlowTableView />
          </div>
        )}

        {!isDocsLoading && docs.length === 0 && (
          <EmptyScreen
            title="No documents found"
            description="Create a new document to get started"
          />
        )}
      </div>
    </div>
  );
};

export default NewFlowPage;
