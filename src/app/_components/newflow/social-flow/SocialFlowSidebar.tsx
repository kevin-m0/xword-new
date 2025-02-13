"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAtom } from "jotai";
import { Button } from "~/components/ui/button";
import { Card, CardDescription, CardHeader } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { ArrowLeft, Loader2, PlusCircle, X } from "lucide-react";
import Image from "next/image";
import {
  postImageAtom,
  postTextAtom,
  selectedLanguageAtom,
} from "~/atoms/socialAtom";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { flowImages, flowVariations, socialFlowId } from "~/atoms/flowAtom";
import { ImageSelector } from "../flow/support/ImageSelector/ImageSelector";
import { useRouter } from "next/navigation";
import { XWTextarea } from "~/components/reusable/XWTextarea";
import { trpc } from "~/trpc/react";

const formSchema = z.object({
  postText: z.string().min(1, "Post text is required"),
  language: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const SocialFlowSidebar = ({ variations }: { variations: string[] }) => {
  const { showToast } = useXWAlert();
  const [selectedLanguage, setSelectedLanguage] = useAtom(selectedLanguageAtom);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [postText, setPostText] = useAtom(postTextAtom);
  const [postImage, setPostImage] = useAtom(postImageAtom);
  const [flowId, setFlowId] = useAtom(socialFlowId);
  const [images, setImages] = useAtom(flowImages);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postText,
      language: selectedLanguage,
    },
  });

  const utils = trpc.useUtils();

  const { mutate: editDocument, isPending } =
    trpc.writerx.editSocialDocument.useMutation({
      onSuccess: () => {
        utils.writerx.fetchSocialDocument.invalidate();
        showToast({
          title: "Saved!",
          message: "Document saved successfully",
          variant: "success",
        });
        setSelectedImageIndex(0);
      },
      onError: (err) => {
        showToast({
          title: "Error!",
          message: err.message,
          variant: "error",
        });
      },
    });

  const onSubmit = (data: FormData) => {
    setPostText(data.postText);
    setSelectedLanguage(data.language);
    editDocument({
      id: flowId as string,
      content: data.postText,
      thumbnailImageUrl:
        selectedImageIndex !== null
          ? (images[selectedImageIndex] as string)
          : (images[0] as string),
      images: images,
    });
  };

  const handleImageSelect = (selected: string[]) => {
    if (selected.length > 0) {
      setImages((prev) => [...prev, selected[0] as string]);
      setUploadedImages((prev) => [...prev, selected[0] as string]);
      setSelectedImageIndex(images.length); // Set the index to the newly added image
      editDocument({
        id: flowId as string,
        content: postText,
        thumbnailImageUrl: selected[0] as string,
        images: [...images, selected[0] as string],
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      if (prev.length <= 1) {
        showToast({
          title: "Notice",
          message: "You cannot remove the last remaining image.",
          variant: "caution",
        });
        return prev; // Prevent state update
      }

      const updatedImages = prev.filter((_, i) => i !== index);
      setUploadedImages(updatedImages);

      if (index === selectedImageIndex) {
        const newIndex = 0;
        setSelectedImageIndex(newIndex);
        setPostImage(updatedImages[newIndex] || null);
      } else if (index < selectedImageIndex!) {
        setSelectedImageIndex((prev) => prev! - 1);
      }

      editDocument({
        id: flowId as string,
        content: postText,
        thumbnailImageUrl: updatedImages[0] || "",
        images: updatedImages,
      });

      return updatedImages;
    });
  };

  const setPreviewImage = (index: number) => {
    setSelectedImageIndex(index);
    setPostImage(uploadedImages[index] as string);
  };

  const handleVariationSelect = (variation: string, index: number) => {
    setValue("postText", variation);
    setSelectedVariation(index);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col"
      >
        <div className="flex items-center gap-4 p-3">
          <Button
            type="button"
            size={"icon"}
            className="rounded-full"
            onClick={() => router.push("/writerx")}
            variant={"secondary"}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Edit Post</h1>
        </div>
        <Separator />

        <div className="xw-scrollbar flex-1 overflow-y-auto">
          <div className="flex flex-col gap-2 p-3">
            <Label className="text-lg">Post Text</Label>
            <Controller
              name="postText"
              control={control}
              render={({ field }) => (
                <XWTextarea
                  {...field}
                  placeholder="Enter post text..."
                  rows={10}
                />
              )}
            />
            {errors.postText && (
              <p className="text-red-500">{errors.postText.message}</p>
            )}
          </div>

          <Separator />

          {/* Variations Section */}
          <div className="flex flex-col gap-2 p-3">
            <Label className="text-lg">Variations</Label>
            {variations &&
              variations.map((variant, index) => (
                <Card
                  key={index}
                  onClick={() => handleVariationSelect(variant, index)}
                  className={`cursor-pointer ${index === selectedVariation ? "border-xw-primary" : ""}`}
                >
                  <CardHeader>
                    {/* <CardTitle>Variant {index + 1}</CardTitle> */}
                    <CardDescription>
                      <span>{variant.split("#")[0]}</span>
                      <br />
                      <span className="text-xw-primary text-sm">
                        #{variant.split("#").slice(1).join("#")}
                      </span>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
          </div>

          <Separator />

          <div className="flex flex-col gap-2 p-3">
            <Label className="text-lg">Post Images</Label>
            <div className="tb:grid-cols-4 grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-square cursor-pointer overflow-hidden rounded-lg ${index === selectedImageIndex ? "border-xw-primary border-2" : "border-xw-border border"}`}
                >
                  <Image
                    src={image}
                    alt={`Uploaded image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    onClick={() => setPreviewImage(index)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 bg-black hover:bg-gray-900"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {images.length < 4 && (
                <Card
                  className="border-xw-border flex aspect-square w-full cursor-pointer items-center justify-center rounded-lg border"
                  onClick={() => setIsImageSelectorOpen(true)}
                >
                  <PlusCircle className="h-8 w-8" />
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="border-xw-border border-t p-5">
          <Button
            type="submit"
            variant={"default"}
            className="gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Image
                src={"/icons/magic.svg"}
                height={16}
                width={16}
                alt="magic"
              />
            )}
            Generate
          </Button>
        </div>
      </form>

      <ImageSelector
        open={isImageSelectorOpen}
        onOpenChange={setIsImageSelectorOpen}
        onImagesSelected={handleImageSelect}
        single={true}
      />
    </>
  );
};

export default SocialFlowSidebar;
