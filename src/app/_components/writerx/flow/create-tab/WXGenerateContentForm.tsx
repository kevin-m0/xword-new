import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
// import { XWTextarea } from '../../../reusable/XWTextarea'
import { Button } from '~/components/ui/button'
import { TooltipContent, Tooltip, TooltipTrigger, TooltipProvider } from '~/components/ui/tooltip'
import Image from 'next/image'
import { XWTextarea } from "~/components/reusable/XWTextarea"

const generateFormSchema = z.object({
    prompt: z.string().min(1, "Please enter what you'd like to create"),
})

type GenerateFormValues = z.infer<typeof generateFormSchema>

const WXGenerateContentForm = () => {
    const form = useForm<GenerateFormValues>({
        resolver: zodResolver(generateFormSchema),
        defaultValues: {
            prompt: "",
        },
    })

    const onSubmit = async (data: GenerateFormValues) => {
        try {
            console.log("Form submitted:", data)
            // Add your generation logic here
        } catch (error) {
            console.error("Error generating content:", error)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-2'>
            <label htmlFor="prompt">
                What will you create today?
            </label>

            <div className='relative'>
                <XWTextarea
                    {...form.register("prompt")}
                    placeholder='Write a Facebook post sharing about product updates'
                    rows={6}
                />
                {form.formState.errors.prompt && (
                    <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.prompt.message}
                    </p>
                )}
                <div className='absolute bottom-3 right-3'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size={"icon"} className='h-9 w-9 rounded-full'>
                                    <Image
                                        src={"/icons/ideabulb.svg"}
                                        alt='idea bulb'
                                        width={20}
                                        height={20}
                                    />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className='p-2 bg-white text-xw-secondary text-sm max-w-xs mx-2'>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <div className='flex items-center justify-end'>
                <Button
                    type="submit"
                    variant={"default"}
                    className='h-9'
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? "Generating..." : "Generate"}
                </Button>
            </div>
        </form>
    )
}

export default WXGenerateContentForm;