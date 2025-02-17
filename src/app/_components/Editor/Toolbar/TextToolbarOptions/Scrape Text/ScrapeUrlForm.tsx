// import { z } from "zod";
// import { toast } from "sonner";
// import { Editor } from "@tiptap/react";
// import { Loader2 } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useScrape } from "@/hooks/editor/useScrape";
// import { ErrorToast, SuccessToast } from "@/components/ui/custom-toast";

// const scrapeUrlSubmissionSchema = z.object({
//   url: z.string().regex(/^(ftp|http|https):\/\/[^ "]+$/, {
//     message: "Please enter a valid link.",
//   }),
// });

// type Inputs = z.infer<typeof scrapeUrlSubmissionSchema>;

// interface ScrapeFormProps {
//   closeModal: () => void;
//   editor: Editor;
// }

// export const ScrapeForm: React.FC<ScrapeFormProps> = ({
//   closeModal,
//   editor,
// }) => {
//   // react-hook-form
//   const form = useForm<Inputs>({
//     resolver: zodResolver(scrapeUrlSubmissionSchema),
//     defaultValues: {
//       url: "",
//     },
//   });

//   const { mutate: scrapeText, isLoading } = useScrape({
//     onSuccess: (data: string) => {
//       editor.commands.insertContentAt(editor.state.selection.anchor, data);
//       toast.custom((t) => (
//         <SuccessToast t={t} title="" description="Data scraped successfully" />
//       ));

//       form.reset();
//       closeModal();
//     },
//     onError: () => {
//       toast.custom((t) => (
//         <ErrorToast
//           t={t}
//           title="Error"
//           description="Something went wrong. Please try again later."
//         />
//       ));
//     },
//   });

//   const handleSubmit = (data: Inputs) => {
//     scrapeText(data.url);
//   };

//   function onSubmit(data: Inputs) {
//     handleSubmit(data);
//   }

//   return (
//     <div className="space-y-4">
//       <Form {...form}>
//         <form
//           id="scrape-url-form"
//           className="grid gap-2"
//           onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
//         >
//           <FormField
//             control={form.control}
//             name="url"
//             render={({ field }) => (
//               <FormItem className="space-y-0">
//                 <FormControl>
//                   <Input
//                     type="text"
//                     disabled={isLoading}
//                     placeholder="Paste your URL here..."
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage className="mt-0" />
//               </FormItem>
//             )}
//           />
//         </form>
//       </Form>
//       <div className="flex items-center justify-center gap-4">
//         <Button
//           variant="gradient"
//           className="py-2 px-4 text-[16px] leading-5"
//           onClick={() => {
//             closeModal();
//           }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="gradient"
//           disabled={form.getValues("url").length === 0 || isLoading}
//           className="p-2 text-[16px] leading-5"
//           form="scrape-url-form"
//           onClick={(...args) => void form.handleSubmit(onSubmit)(...args)}
//         >
//           {isLoading ? (
//             <Loader2 className="h-3 w-3 mr-2 animate-spin" />
//           ) : (
//             <div className="flex items-center justify-center gap-2">
//               <div className="">Scrape</div>
//               {/* <Menu /> */}
//             </div>
//           )}
//           <span className="sr-only">Scrape</span>
//         </Button>
//       </div>
//     </div>
//   );
// };
