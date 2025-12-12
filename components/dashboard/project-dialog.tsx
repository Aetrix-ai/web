"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, X, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { IKContext, IKUpload } from "imagekitio-react";

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
import { Project } from "./types";
import { Image } from "@imagekit/react";

const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

const projectFormSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  demoLink: z.string().url().optional().or(z.literal("")),
  repoLink: z.string().url().optional().or(z.literal("")),
  techStack: z.string().optional(),
  additionalInfo: z.string().max(1000).optional(),
  images: z.array(z.string().url()).optional().default([]),
  videos: z.array(z.string().url()).optional().default([]),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectDialogProps {
  project?: Project;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProjectDialog({ project, trigger, open: controlledOpen, onOpenChange }: ProjectDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isVideoUploading, setIsVideoUploading] = useState(false);
  const queryClient = useQueryClient();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      demoLink: "",
      repoLink: "",
      techStack: "",
      additionalInfo: "",
      images: [],
      videos: [],
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        description: project.description,
        demoLink: project.demoLink || "",
        repoLink: project.repoLink || "",
        techStack: project.techStack.join(", "),
        additionalInfo: project.additionalInfo || "",
        images: project.images || [],
        videos: project.videos || [],
      });
    } else {
      form.reset({
        title: "",
        description: "",
        demoLink: "",
        repoLink: "",
        techStack: "",
        additionalInfo: "",
        images: [],
        videos: [],
      });
    }
  }, [project, form, open]);

  const mutation = useMutation({
    mutationFn: async (values: ProjectFormValues) => {
      const token = localStorage.getItem("token");
      const payload = {
        ...values,
        techStack: values.techStack
          ? values.techStack
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      if (project?.id) {
        const res = await apiClient.put(`/user/profile/project/${project.id}`, payload, {
          headers: { authorization: token || "" },
        });
        return res.data;
      } else {
        const res = await apiClient.post("/user/profile/project", payload, {
          headers: { authorization: token || "" },
        });
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
      const response = await apiClient.get("/media/authenticate-upload", {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });
      return { ...response.data };
    } catch (error: any) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const handleUploadSuccess = (res: any, type: "images" | "videos") => {
    if (type === "images") setIsImageUploading(false);
    else setIsVideoUploading(false);
    const current = form.getValues(type);
    form.setValue(type, [...current, res.url]);
    toast.success("Upload successful");
  };

  const handleUploadError = (err: any, type: "images" | "videos") => {
    if (type === "images") setIsImageUploading(false);
    else setIsVideoUploading(false);
    console.error("Upload error", err);
    toast.error("Upload failed");
  };

  const removeMedia = (type: "images" | "videos", index: number) => {
    const current = form.getValues(type);
    const newMedia = [...current];
    newMedia.splice(index, 1);
    form.setValue(type, newMedia);
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
              <Input id="techStack" {...form.register("techStack")} placeholder="React, Node.js, TypeScript" />
              {form.formState.errors.techStack && (
                <p className="text-sm text-red-500">{form.formState.errors.techStack.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="additionalInfo">Additional Info</Label>
              <Textarea id="additionalInfo" {...form.register("additionalInfo")} placeholder="Any extra details..." />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Images</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.watch("images").map((url, index) => (
                  <div key={index} className="relative w-20 h-20 border rounded overflow-hidden group">
                    <Image
                      urlEndpoint={IMAGEKIT_URL_ENDPOINT}
                      src={url}
                      alt={`Project ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      onClick={() => removeMedia("images", index)}
                      size={"sm"}
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
                  fileName="project-image.jpg"
                  tags={["project-image"]}
                  useUniqueFileName={true}
                  validateFile={(file) => file.size < 5000000}
                  onUploadStart={() => setIsImageUploading(true)}
                  onSuccess={(res) => handleUploadSuccess(res, "images")}
                  onError={(err) => handleUploadError(err, "images")}
                  style={{ display: "none" }}
                  id="image-upload"
                  accept="image/*"
                />
                <Label
                  htmlFor="image-upload"
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

            {/* Video Upload */}
            <div className="space-y-2">
              <Label>Videos</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.watch("videos").map((url, index) => (
                  <div key={index} className="relative w-20 h-20 border rounded overflow-hidden group bg-black">
                    <video src={url} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeMedia("videos", index)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
              <IKContext
                publicKey={IMAGEKIT_PUBLIC_KEY}
                urlEndpoint={IMAGEKIT_URL_ENDPOINT}
                authenticator={authenticator}
              >
                <IKUpload
                  fileName="project-video.mp4"
                  tags={["project-video"]}
                  useUniqueFileName={true}
                  validateFile={(file) => file.size < 50000000} // 50MB limit for video?
                  onUploadStart={() => setIsVideoUploading(true)}
                  onSuccess={(res) => handleUploadSuccess(res, "videos")}
                  onError={(err) => handleUploadError(err, "videos")}
                  style={{ display: "none" }}
                  id="video-upload"
                  accept="video/*"
                />
                <Label
                  htmlFor="video-upload"
                  className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                >
                  {isVideoUploading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <VideoIcon className="mr-2 size-4" />
                  )}
                  Upload Video
                </Label>
              </IKContext>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending || isImageUploading || isVideoUploading}>
              {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {project ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
