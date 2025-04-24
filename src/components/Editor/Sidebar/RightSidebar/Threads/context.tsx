// import { User } from "@prisma/client";
// import {
// 	createContext,
// 	useState,
// 	useCallback,
// 	useContext,
// 	ReactNode,
// } from "react";

// interface ThreadsProviderProps {
// 	children: ReactNode;
// 	threads?: any[];
// 	selectedThreads?: any[];
// 	onClickThread?: (threadId: string) => void;
// 	onDeleteThread?: (threadId: string) => void;
// 	onResolveThread?: (threadId: string) => void;
// 	onUnresolveThread?: (threadId: string) => void;
// 	onUpdateComment?: (
// 		threadId: string,
// 		commentId: string,
// 		content: string,
// 		userData: User
// 	) => void;
// 	onHoverThread?: (threadId: string) => void;
// 	onLeaveThread?: (threadId: string) => void;
// }
// type ThreadsContextType = {
// 	threads: any[];
// 	selectedThreads: any[];
// 	selectedThread: string | null;
// 	onClickThread: (threadId: string) => void;
// 	deleteThread: (threadId: string) => void;
// 	resolveThread: (threadId: string) => void;
// 	unresolveThread: (threadId: string) => void;
// 	onCloseThread: () => void;
// 	selectThread: (threadId: string) => void;
// 	unselectThread: (threadId: string) => void;
// 	onUpdateComment: (
// 		threadId: string,
// 		commentId: string,
// 		content: string,
// 		metaData: any
// 	) => void;
// 	onHoverThread: (threadId: string) => void;
// 	onLeaveThread: (threadId: string) => void;
// };

// export const ThreadsContext = createContext<ThreadsContextType>({
// 	threads: [],
// 	selectedThreads: [],
// 	selectedThread: null,
// 	onClickThread: () => {},
// 	deleteThread: () => {},
// 	resolveThread: () => {},
// 	unresolveThread: () => {},
// 	onCloseThread: () => {},
// 	selectThread: () => {},
// 	unselectThread: () => {},
// 	onUpdateComment: () => {},
// 	onHoverThread: () => {},
// 	onLeaveThread: () => {},
// });

// export const ThreadsProvider = ({
// 	children,
// 	threads = [],
// 	selectedThreads = [],
// 	onClickThread = () => null,
// 	onDeleteThread = () => null,
// 	onResolveThread = () => null,
// 	onUnresolveThread = () => null,
// 	onUpdateComment = () => null,
// 	onHoverThread = () => null,
// 	onLeaveThread = () => null,
// }: ThreadsProviderProps) => {
// 	const [selectedThread, setSelectedThread] = useState<string>("");

// 	const handleThreadClick = useCallback(
// 		(threadId: string) => {
// 			setSelectedThread((currentThreadId) => {
// 				if (currentThreadId !== threadId) {
// 					onClickThread(threadId);
// 					setSelectedThread(threadId);
// 				}
// 				return currentThreadId !== threadId ? threadId : "";
// 			});
// 		},
// 		[onClickThread]
// 	);

// 	const onCloseThread = useCallback(() => {
// 		setSelectedThread("");
// 	}, []);

// 	const providerValue = {
// 		threads,
// 		selectedThreads,
// 		selectedThread,
// 		deleteThread: onDeleteThread,
// 		resolveThread: onResolveThread,
// 		unresolveThread: onUnresolveThread,
// 		onClickThread: handleThreadClick,
// 		onUpdateComment,
// 		onCloseThread,
// 		selectThread: () => null,
// 		unselectThread: () => null,
// 		onHoverThread,
// 		onLeaveThread,
// 	};

// 	return (
// 		<ThreadsContext.Provider value={providerValue}>
// 			{children}
// 		</ThreadsContext.Provider>
// 	);
// };

// export const useThreadsState = () => {
// 	return useContext(ThreadsContext);
// };
