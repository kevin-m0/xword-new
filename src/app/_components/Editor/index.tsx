// "use client";
// import React, { use, useCallback, useEffect, useState } from "react";
// import TextEditorPage from "./TextEditorPage";
// import * as Y from "yjs";
// import { TiptapCollabProvider } from "@hocuspocus/provider";
// import axios from "axios";
// import { trpc } from "@/app/_trpc/client";
// import { useRouter } from "next/navigation";
// import { useSetAtom } from "jotai";
// import { yjsProviderLoading } from "@/atoms";
// import { AccessDenied } from "../_error/AccessDenied";
// import CustomLoader from "../ui/custom-loader";

// export default function Room({
// 	documentId,
// 	name,
// 	isForContentGen
// }: {
// 	documentId: string;
// 	name: string;
// 	isForContentGen: boolean;
// }) {
// 	const [token, setToken] = useState("");
// 	const [provider, setProvider] = useState<TiptapCollabProvider>();
// 	const [doc, setDoc] = useState<Y.Doc | undefined>(undefined);
// 	const setLoadingYDoc = useSetAtom(yjsProviderLoading);

// 	const router = useRouter();
// 	const {
// 		data: currentDocument,
// 		isLoading,
// 		isError,
// 	} = trpc.document.getDocById.useQuery(
// 		{
// 			id: documentId,
// 		},
// 		{ refetchOnMount: false, refetchOnWindowFocus: false }
// 	);
// 	const providerSetup = useCallback(async () => {
// 		try {
// 			setLoadingYDoc(true);
// 			const newDoc = new Y.Doc();
// 			const { data } = await axios.get("/api/getToken/collab");
// 			setToken(data);
// 			setDoc(newDoc);
// 			if (newDoc && data) {
// 				const tiptapProvider = new TiptapCollabProvider({
// 					name: documentId,
// 					appId: process.env.NEXT_PUBLIC_TIPTAP_APPID as string,
// 					token: data,
// 					document: newDoc,
// 				});
// 				setProvider(tiptapProvider);
// 				setLoadingYDoc(false);
// 			}
// 		} catch (error) {
// 			setLoadingYDoc(false);
// 			console.error("Error fetching token:", error);
// 		}
// 	}, [documentId, setLoadingYDoc]);

// 	useEffect(() => {
// 		providerSetup();
// 	}, [providerSetup]);

// 	// Turn off the loading state when the document is synced.
// 	useEffect(() => {
// 		const onSync = (isSynced: boolean) => {
// 			if (isSynced) {
// 				setLoadingYDoc(false);
// 			}
// 		};
// 		if (provider) {
// 			provider.on("sync", onSync);
// 		}
// 		return () => {
// 			provider?.off("sync", onSync);
// 		};
// 	}, [provider, setLoadingYDoc]);

// 	if (isLoading) {
// 		return (
// 			<div className="flex justify-center items-center flex-col h-[92vh]">
// 				<div className="gap-y-6">
// 					<CustomLoader />
// 					<p className="text-gray-500">Setting up things for you</p>
// 				</div>
// 			</div>
// 		);
// 	}
// 	if (isError) {
// 		return <AccessDenied />;
// 	}

// 	return (
// 		<>
// 			{doc && token && provider && (
// 				<TextEditorPage
// 					doc={doc}
// 					provider={provider}
// 					name={name}
// 					documentId={documentId}
// 					currentDocument={currentDocument}
// 					isForContentGen={isForContentGen}
// 				/>
// 			)}
// 		</>
// 	);
// }
