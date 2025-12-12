"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, X, Image as ImageIcon } from "lucide-react";
import { IKContext, IKUpload } from "imagekitio-react";
import { Image } from "@imagekit/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/utils";
import { Achievement } from "./types";

const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

const achievementFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  images: z.array(z.string().url()).optional().default([]),
});

type AchievementFormValues = z.infer<typeof achievementFormSchema>;

interface AchievementDialogProps {
  achievement?: Achievement;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AchievementDialog({
  achievement,
  trigger,
  open: controlledOpen,
  onOpenChange,
}: AchievementDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const queryClient = useQueryClient();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const form = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      images: [],
    },
  });

  useEffect(() => {
    if (achievement) {
      form.reset({
        title: achievement.title,
        description: achievement.description,
        date: new Date(achievement.date).toISOString().split("T")[0],
        images: achievement.images || [],
      });
    } else {
      form.reset({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        images: [],
      });
    }
  }, [achievement, form, open]);

  const mutation = useMutation({
    mutationFn: async (values: AchievementFormValues) => {
      const token = localStorage.getItem("token");
      const payload = {
        ...values,
        date: new Date(values.date).toISOString(),
      };

      console.log("Payload being sent to backend:", payload);

      if (achievement) {
        const res = await apiClient.put(`user/profile/achievement/${achievement.id}`, payload, {
          headers: { Authorization: token || "" },
        });
        return res.data;
      } else {
        const res = await apiClient.post("user/profile/achievement", payload, {
          headers: { Authorization: token || "" },
        });
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success(achievement ? "Achievement updated" : "Achievement added");
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save achievement");
    },
  });

  const onSubmit = (data: AchievementFormValues) => {
    console.log("Submitting achievement data:", data);
    mutation.mutate(data);
  };

  const authenticator = async () => {
    try {
      const response = await apiClient.get("/media/authenticate-upload", {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });

      return { ...response.data };
    } catch (error: any) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const onError = (err: any) => {
    console.log("Error", err);
    toast.error("Image upload failed");
    setIsImageUploading(false);
  };

  const onSuccess = (res: any) => {
    console.log("Upload success response:", res);
    const currentImages = form.getValues("images") || [];
    console.log("Current images before update:", currentImages);
    form.setValue("images", [...currentImages, res.url]);
    console.log("Images after update:", form.getValues("images"));
    setIsImageUploading(false);
    toast.success("Image uploaded");
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", newImages);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{achievement ? "Edit Achievement" : "Add Achievement"}</DialogTitle>
          <DialogDescription>
            {achievement ? "Update your achievement details." : "Add a new achievement to your profile."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Hackathon Winner 2024" {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...form.register("date")} />
              {form.formState.errors.date && (
                <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your achievement..."
                className="min-h-[100px]"
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.watch("images")?.map((url, index) => (
                  <div key={index} className="relative w-20 h-20 border rounded overflow-hidden group">
                    <Image
                      urlEndpoint={IMAGEKIT_URL_ENDPOINT}
                      src={url}
                      alt={`Achievement ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      onClick={() => removeImage(index)}
                      size="sm"
                      className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <IKContext
                publicKey={IMAGEKIT_PUBLIC_KEY}
                urlEndpoint={IMAGEKIT_URL_ENDPOINT}
                authenticator={authenticator}
              >
                <IKUpload
                  fileName="achievement-image.jpg"
                  tags={["achievement"]}
                  useUniqueFileName={true}
                  validateFile={(file) => file.size < 5 * 1024 * 1024}
                  onUploadStart={() => setIsImageUploading(true)}
                  onSuccess={onSuccess}
                  onError={onError}
                  style={{ display: "none" }}
                  id="achievement-image-upload"
                  accept="image/*"
                />
                <Label
                  htmlFor="achievement-image-upload"
                  className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  {isImageUploading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <ImageIcon className="mr-2 size-4" />
                  )}
                  Upload Image
                </Label>
              </IKContext>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending || isImageUploading}>
              {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {achievement ? "Save Changes" : "Add Achievement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
