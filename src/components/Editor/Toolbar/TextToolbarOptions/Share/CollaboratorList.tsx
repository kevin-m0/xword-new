// import { trpc } from "@/app/_trpc/client";
// import { SuccessToast } from "@/components/ui/custom-toast";
// import { ACCESSTYPE } from "@prisma/client";
// import { Loader } from "lucide-react";
// import React, { useState } from "react";
// import { toast } from "sonner";

// export default function CollaboratorList({ id }: { id: string }) {
// 	const [deleteBarId, setDeleteBarId] = useState("");
// 	const utils = trpc.useUtils();

// 	const { data: collaboratedDocuments } =
// 		trpc.document.getCollaborators.useQuery({ id });

// 	const { mutate: revokeCollab, isLoading: revokeCollabLoading } =
// 		trpc.document.removeCollaborator.useMutation({
// 			onSuccess: () => {
// 				utils.document.getCollaborators.invalidate();
// 				toast.custom((t) => (
// 					<SuccessToast
// 						t={t}
// 						title=""
// 						description="Collaborator removed"
// 					/>
// 				));
// 			},
// 		});

// 	return (
// 		<div className="mt-5 relative z-50 px-1 ">
// 			{collaboratedDocuments?.map((doc: any) => (
// 				<div
// 					className="flex flex-row justify-between items-center border border-1 rounded-lg p-2 px-4 mb-1"
// 					key={doc.id}
// 				>
// 					<div className="">
// 						<div className="">{doc.User?.email}</div>
// 						<div className="text-xs text-gray-500">
// 							{doc?.access === ACCESSTYPE.READ ? "READ" : "WRITE"}
// 						</div>
// 					</div>
// 					<div
// 						className="cursor-pointer text-xs text-red-500"
// 						onClick={() => {
// 							setDeleteBarId(doc.id);
// 							revokeCollab({ userId: doc.userId, id: doc.redirectId });
// 						}}
// 					>
// 						{revokeCollabLoading && deleteBarId === doc.id ? (
// 							<Loader className="h-4 w-4 animate-spin" />
// 						) : (
// 							"Revoke"
// 						)}
// 					</div>
// 				</div>
// 			))}
// 		</div>
// 	);
// }
