// import { useThreadsState } from "./context";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Open from "./ThreadType/Open";
// import Resolved from "./ThreadType/Resolved";
// import { ScrollArea } from "@/components/ui/scroll-area";

// export default function Threads({ provider }: { provider: any }) {
// 	const { threads, selectedThreads, selectedThread } = useThreadsState();

// 	if (!threads) {
// 		return null;
// 	}

// 	const unresolvedThreads = threads.filter((t) => !t.resolvedAt);
// 	const resolvedThreads = threads.filter((t) => !!t.resolvedAt);
// 	if (unresolvedThreads.length === 0 && resolvedThreads.length === 0) {
// 		return (
// 			<div className="h-[calc(100vh-188px)] w-full comments-bg rounded-[14px] border border-white border-opacity-10 flex flex-col items-center justify-center text-center text-sm font-medium">
// 				No threads
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="comments-bg rounded-[14px] border border-white border-opacity-10 h-[calc(100vh-188px)] bg-green-500 relative p-3 overflow-hidden">
// 			<div className="absolute comments-gradient" />
// 			<Tabs
// 				defaultValue="open"
// 				className="w-full relative z-50"
// 			>
// 				<TabsList className="flex">
// 					<TabsTrigger
// 						value="open"
// 						className="flex-1 "
// 					>
// 						Open Threads
// 					</TabsTrigger>
// 					<TabsTrigger
// 						value="resolved"
// 						className="flex-1"
// 					>
// 						Resolved Threads
// 					</TabsTrigger>
// 				</TabsList>
// 				<ScrollArea className="h-[calc(100vh-225px)]">
// 					<TabsContent value="open">
// 						<Open
// 							threads={unresolvedThreads}
// 							selectedThread={selectedThread}
// 							selectedThreads={selectedThreads}
// 							provider={provider}
// 						/>
// 					</TabsContent>
// 					<TabsContent value="resolved">
// 						<Resolved
// 							threads={resolvedThreads}
// 							selectedThread={selectedThread}
// 							selectedThreads={selectedThreads}
// 							provider={provider}
// 						/>
// 					</TabsContent>
// 				</ScrollArea>
// 			</Tabs>
// 		</div>
// 	);
// }
