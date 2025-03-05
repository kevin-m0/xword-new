// import React from "react";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import {
// 	Form,
// 	FormControl,
// 	FormField,
// 	FormItem,
// 	FormMessage,
// } from "@/components/ui/form";
// import {
// 	Select,
// 	SelectContent,
// 	SelectGroup,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";
// import "@/components/Editor/styles.css";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { trpc } from "@/app/_trpc/client";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Check, Loader } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { ACCESSTYPE } from "@prisma/client";
// import { SuccessToast } from "@/components/ui/custom-toast";

// const docInvitationSchema = z.object({
// 	collaboratorEmail: z
// 		.string()
// 		.email({ message: "Please enter a valid email" }),

// 	accessType: z.enum(["READ", "WRITE"]),
// });

// type Inputs = z.infer<typeof docInvitationSchema>;

// export default function CollaboratorForm({
// 	title,
// 	redirectId,
// }: {
// 	title: string;
// 	redirectId: string;
// }) {
// 	const utils = trpc.useUtils();
// 	const form = useForm<Inputs>({
// 		resolver: zodResolver(docInvitationSchema),
// 		defaultValues: {
// 			collaboratorEmail: "",
// 			accessType: "WRITE",
// 		},
// 	});

// 	const { mutate: addCollaborator, isLoading: addCollabLoading } =
// 		trpc.document.addCollaborator.useMutation({
// 			onSuccess: () => {
// 				utils.document.getCollaborators.invalidate();
// 				toast.success("Collaborator added");
// 			},
// 			onSettled: () => {
// 				form.setValue("collaboratorEmail", "");
// 			},
// 		});

// 	const handleSubmit = (data: Inputs) => {
// 		addCollaborator({
// 			title: title,
// 			access: data.accessType === "WRITE" ? ACCESSTYPE.WRITE : ACCESSTYPE.READ,
// 			redirectId: redirectId,
// 			collaboratorEmail: data.collaboratorEmail,
// 		});
// 	};
// 	return (
// 		<Form {...form}>
// 			<form
// 				id="doc-invitation-form"
// 				onSubmit={(...args) => void form.handleSubmit(handleSubmit)(...args)}
// 			>
// 				<div className="mt-[12px] flex items-center space-x-2 relative z-50">
// 					<FormField
// 						control={form.control}
// 						name="collaboratorEmail"
// 						render={({ field }) => (
// 							<>
// 								<FormItem className="w-full">
// 									<FormMessage />
// 									<div className="flex flex-col items-center gap-2">
// 										<FormControl>
// 											<Input
// 												className="border  border-black bg-slate-800"
// 												disabled={addCollabLoading}
// 												placeholder="johndoe@gmail.com"
// 												{...field}
// 											/>
// 										</FormControl>
// 										<div className="flex items-center gap-2">

// 										<Select
// 											disabled={addCollabLoading}
// 											defaultValue={form.getValues("accessType")}
// 											onValueChange={(accessType: "READ" | "WRITE") =>
// 												form.setValue("accessType", accessType)
// 											}
// 											>
// 											<SelectTrigger className="w-[180px]">
// 												<SelectValue
// 													defaultValue={form.getValues("accessType")}
// 													/>
// 											</SelectTrigger>
// 											<SelectContent>
// 												<SelectItem
// 													value="READ"
// 													className="text-[14px] font-normal leading-[15px]"
// 													>
// 													READ
// 												</SelectItem>
// 												<div className="dividerLine" />
// 												<SelectItem
// 													value="WRITE"
// 													className="text-[14px] font-normal leading-[15px]"
// 													>
// 													WRITE
// 												</SelectItem>
// 											</SelectContent>
// 										</Select>
// 										<Button
// 											disabled={!form.getValues("collaboratorEmail")}
// 											className=""
// 											>
// 											{addCollabLoading ? (
// 												<Loader className="h-4 w-4 animate-spin" />
// 											) : (
// 												<Check />
// 											)}
// 										</Button>
// 											</div>
// 									</div>
// 								</FormItem>
// 							</>
// 						)}
// 					/>
// 				</div>
// 			</form>
// 		</Form>
// 	);
// }
