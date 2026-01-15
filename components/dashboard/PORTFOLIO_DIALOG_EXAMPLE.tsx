/**
 * EXAMPLE: How to add MediaUploader to a new page/component
 *
 * This example shows how to add media upload to a "Portfolio" dialog
 * using a different API endpoint.
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MediaUploader } from "@/components/ui/media-uploader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Media, achievementSchema } from "@/lib/schema";
import { apiClientWithAuth, PORTFOLIO_API_URL } from "@/lib/utils";

const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

// Define your own schema
const portfolioItemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  media: z.array(z.object({
    fileId: z.string(),
    type: z.enum(["IMAGE", "VIDEO"]),
    url: z.string().url(),
    additional: z.string().optional(),
  })),
});

type PortfolioFormValues = z.infer<typeof portfolioItemSchema>;

interface PortfolioDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PortfolioDialog({ open: controlledOpen, onOpenChange }: PortfolioDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const queryClient = useQueryClient();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioItemSchema),
    defaultValues: {
      title: "",
      description: "",
      media: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: PortfolioFormValues) => {
      const payload = {
        ...values,
      };
      const res = await apiClientWithAuth().post(`${PORTFOLIO_API_URL}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Portfolio item added");
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to save portfolio item";
      toast.error(message);
    },
  });

  async function onSubmit(data: PortfolioFormValues) {
    mutation.mutate(data);
  }

  // ⭐ KEY POINT: Use your own authentication endpoint
  // This is different from Project and Achievement endpoints!
  const authenticator = async () => {
    try {
      const response = await apiClientWithAuth().get("/portfolio/authenticate-upload");
      return { ...response.data };
    } catch (error: any) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Portfolio Item</DialogTitle>
          <DialogDescription>
            Add a new item to your portfolio with images or videos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            {/* Title Field */}
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Portfolio Item Title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe your portfolio item..."
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* ⭐ MediaUploader Component - Single line! */}
            <MediaUploader
              media={form.watch("media")}
              onMediaChange={(newMedia) => form.setValue("media", newMedia)}
              isUploading={isMediaUploading}
              authenticator={authenticator}
              onUploadStart={() => setIsMediaUploading(true)}
              onUploadSuccess={() => setIsMediaUploading(false)}
              onUploadError={() => setIsMediaUploading(false)}
              imageKitPublicKey={IMAGEKIT_PUBLIC_KEY}
              imageKitUrlEndpoint={IMAGEKIT_URL_ENDPOINT}
              uploadId="portfolio-media-upload"
              fileName="portfolio-item"
              tags={["portfolio"]}
              maxFileSize={100 * 1024 * 1024} // 100MB for portfolio
              accept="image/*,video/*"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={mutation.isPending || isMediaUploading}
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Save Portfolio Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/**
 * KEY DIFFERENCES FROM PROJECT/ACHIEVEMENT:
 *
 * 1. Different API Endpoint
 *    - authenticator calls: /portfolio/authenticate-upload
 *    - submitFn calls: PORTFOLIO_API_URL
 *
 * 2. Different Configuration
 *    - uploadId: "portfolio-media-upload"
 *    - fileName: "portfolio-item"
 *    - tags: ["portfolio"]
 *    - maxFileSize: 100MB (vs 50MB for others)
 *
 * 3. Same MediaUploader Component
 *    - No need to duplicate upload code
 *    - Just pass different props
 *
 * THIS PATTERN WORKS FOR ANY PAGE/ENDPOINT!
 */
