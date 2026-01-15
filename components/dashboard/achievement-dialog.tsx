"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { IKContext, IKUpload } from "imagekitio-react";

import { Button } from "@/components/ui/button";
import { MediaUploader } from "@/components/ui/media-uploader";
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
import { ACHIEVEMENT_API_URL, apiClient, apiClientWithAuth } from "@/lib/utils";
import { Achievement } from "./types";
import { achievementSchema } from "@/lib/schema";

const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";



type AchievementFormValues = z.infer<typeof achievementSchema>;

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
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const queryClient = useQueryClient();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const form = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      media: [],
    },
  });

  useEffect(() => {
    if (achievement) {
      form.reset({
        title: achievement.title,
        description: achievement.description,
        date: new Date(achievement.date).toISOString().split("T")[0],
        media: achievement.media || [],
      });
    } else {
      form.reset({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        media: [],
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
        const res = await apiClientWithAuth().put(`${ACHIEVEMENT_API_URL}/${achievement.id}`, payload);
        return res.data;
      } else {
        const res = await apiClientWithAuth().post(ACHIEVEMENT_API_URL, payload);
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
      const response = await apiClientWithAuth().get("/media/authenticate-upload");
      return { ...response.data };
    } catch (error: any) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
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

            {/* Media Upload */}
            <MediaUploader
              media={form.watch("media") || []}
              onMediaChange={(newMedia) => form.setValue("media", newMedia)}
              isUploading={isMediaUploading}
              authenticator={authenticator}
              onUploadStart={() => setIsMediaUploading(true)}
              onUploadSuccess={() => setIsMediaUploading(false)}
              onUploadError={() => setIsMediaUploading(false)}
              imageKitPublicKey={IMAGEKIT_PUBLIC_KEY}
              imageKitUrlEndpoint={IMAGEKIT_URL_ENDPOINT}
              uploadId="achievement-media-upload"
              fileName="achievement-media"
              tags={["achievement-media"]}
              maxFileSize={50 * 1024 * 1024}
              accept="image/*,video/*"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending || isMediaUploading}>
              {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {achievement ? "Save Changes" : "Add Achievement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
