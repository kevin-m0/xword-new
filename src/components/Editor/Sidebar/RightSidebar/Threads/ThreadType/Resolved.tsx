// import React from "react";
// import { ThreadsItem } from "../ThreadsItem";
// import { ScrollArea } from "@/components/ui/scroll-area";

// export default function Resolved({
// 	threads,
// 	selectedThread,
// 	selectedThreads,
// 	provider,
// }: {
// 	threads: any;
// 	selectedThread: any;
// 	selectedThreads: any[];
// 	provider: any;
// }) {
// 	return (
// 		<ScrollArea className="h-full">
// 			<div className="flex flex-col gap-3">
// 				{threads.map((t: any) => (
// 					<ThreadsItem
// 						key={t.id}
// 						thread={t}
// 						active={selectedThreads.includes(t.id) || selectedThread === t.id}
// 						open={selectedThread === t.id}
// 						provider={provider}
// 					/>
// 				))}
// 			</div>
// 		</ScrollArea>
// 	);
// }
