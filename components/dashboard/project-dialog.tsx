"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
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
import { apiClient, apiClientWithAuth, AUTHENTICATE_MEDIA_UPLOAD_URL, MEDIA_API_URL, PROJECT_API_URL } from "@/lib/utils";
import { Project } from "./types";
import { projectSchema } from "@/lib/schema";

const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  project?: Project;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProjectDialog({ project, trigger, open: controlledOpen, onOpenChange }: ProjectDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isMediaUploading, setIsMediaUploading] = useState(false);
  const queryClient = useQueryClient();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      demoLink: "",
      repoLink: "",
      techStack: [],
      additionalInfo: "",
      media: [],
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        description: project.description,
        demoLink: project.demoLink || "",
        repoLink: project.repoLink || "",
        techStack: project.techStack,
        additionalInfo: project.additionalInfo || "",
        media: project.media || [],
      });
    } else {
      form.reset({
        title: "",
        description: "",
        demoLink: "",
        repoLink: "",
        techStack: [],
        additionalInfo: "",
        media: [],
      });
    }
  }, [project, form, open]);

  const mutation = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const payload = {
        ...values,
        techStack: values.techStack.filter((tech) => tech.trim() !== ""),
      };

      if (project?.id) {
        const res = await apiClientWithAuth().put(`${PROJECT_API_URL}/${project.id}`, payload);
        return res.data;
      } else {
        const res = await apiClientWithAuth().post(`${PROJECT_API_URL}`, payload);
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success(project ? "Project updated successfully" : "Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to save project";
      toast.error(message);
    },
  });

  async function onSubmit(data: ProjectFormValues) {
    mutation.mutate(data);
  }

  const authenticator = async () => {
    try {
      const response = await apiClientWithAuth().get(AUTHENTICATE_MEDIA_UPLOAD_URL);
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
          <DialogTitle>{project ? "Edit Project" : "Add Project"}</DialogTitle>
          <DialogDescription>
            {project ? "Update your project details." : "Add a new project to your portfolio."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} placeholder="Project Title" />
              {form.formState.errors.title && (
                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...form.register("description")} placeholder="Project Description" />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="demoLink">Demo Link</Label>
                <Input id="demoLink" {...form.register("demoLink")} placeholder="https://demo.com" />
                {form.formState.errors.demoLink && (
                  <p className="text-sm text-red-500">{form.formState.errors.demoLink.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="repoLink">Repo Link</Label>
                <Input id="repoLink" {...form.register("repoLink")} placeholder="https://github.com/..." />
                {form.formState.errors.repoLink && (
                  <p className="text-sm text-red-500">{form.formState.errors.repoLink.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="techStack">Tech Stack (comma separated)</Label>
              <Input
                id="techStack"
                placeholder="React, Node.js, TypeScript"
                defaultValue={project?.techStack?.join(", ") || ""}
                onChange={(e) => {
                  const tags = e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag !== "");
                  form.setValue("techStack", tags);
                }}
              />
              {form.formState.errors.techStack && (
                <p className="text-sm text-red-500">{form.formState.errors.techStack.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="additionalInfo">Additional Info</Label>
              <Textarea id="additionalInfo" {...form.register("additionalInfo")} placeholder="Any extra details..." />
            </div>

            {/* Media Upload */}
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
              uploadId="project-media-upload"
              fileName="project-media"
              tags={["project-media"]}
              maxFileSize={50 * 1024 * 1024}
              accept="image/*,video/*"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending || isMediaUploading}>
              {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {project ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
