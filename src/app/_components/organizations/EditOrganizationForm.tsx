"use client";

import { useState, useEffect } from "react";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { useXWAlert } from "~/components/reusable/xw-alert";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Organization name must be at least 2 characters.",
  }),
});

export default function EditOrganizationForm() {
  const { organization, isLoaded } = useOrganization();
  const { userMemberships } = useOrganizationList();
  const { showToast } = useXWAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isLoaded && organization) {
      form.reset({ name: organization.name });
    }
  }, [isLoaded, organization, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!organization) return;

    setIsSubmitting(true);
    try {
      await organization.update({ name: values.name });

      await Promise.all([
        // organization?.update(),
        userMemberships?.revalidate?.(),
      ]);
      showToast({
        title: "Organization updated",
        message: "Your organization name has been successfully updated.",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      showToast({
        title: "Error",
        message:
          "There was a problem updating your organization. Please try again.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isLoaded) {
    return (
      <Card className="mx-auto mt-8 w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!organization) {
    return null;
  }

  return (
    <Card className="mt-8 w-full">
      <CardHeader>
        <CardTitle>Update Organization</CardTitle>
        <CardDescription>
          Change the name of your organization here.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full items-center gap-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-1">
                  <FormControl>
                    <Input
                      className="w-full flex-1"
                      placeholder="Enter organization name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button
                type="submit"
                variant={"default"}
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Organization"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
