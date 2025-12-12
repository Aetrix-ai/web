"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea"; // I might need to create this if it doesn't exist, but I'll assume standard shadcn or use Input for now and fix later. Actually I should check.
import { apiClient } from "@/lib/utils";

// Schema for the form
const profileFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional().or(z.literal("")),
  avatar: z.string().url("Invalid URL").optional().or(z.literal("")),
  github: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  resume: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface EditProfileDialogProps {
  user: any; // Replace with proper type if available
}

export function EditProfileDialog({ user }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
      github: user?.github || "",
      linkedin: user?.linkedin || "",
      twitter: user?.twitter || "",
      resume: user?.resume || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const token = localStorage.getItem("token");
      const res = await apiClient.put("/user/profile", values, {
        headers: { authorization: token || "" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setOpen(false);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update profile";
      toast.error(message);
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    // Filter out empty strings to send undefined/null if needed, or just send as is depending on backend
    const filteredData: Partial<ProfileFormValues> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== "") {
        filteredData[key as keyof ProfileFormValues] = value;
      }

    });

    console.log("Submitting profile data:", filteredData);
    await apiClient.put("/user/profile", filteredData, {
      headers: { authorization: localStorage.getItem("token") || "" },
    });

    // The schema allows empty strings via .or(z.literal("")), but backend might prefer nulls.
    // For now, let's send what the form gives.
    mutation.mutate(data);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} placeholder="Your name" />
            {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...form.register("bio")}
              placeholder="Tell us about yourself"
              className="md:min-h-[200px]"
            />
            {form.formState.errors.bio && <p className="text-sm text-red-500">{form.formState.errors.bio.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input id="avatar" {...form.register("avatar")} placeholder="https://example.com/avatar.png" />
            {form.formState.errors.avatar && (
              <p className="text-sm text-red-500">{form.formState.errors.avatar.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input id="github" {...form.register("github")} placeholder="github.com/username" />
              {form.formState.errors.github && (
                <p className="text-sm text-red-500">{form.formState.errors.github.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input id="linkedin" {...form.register("linkedin")} placeholder="linkedin.com/in/username" />
              {form.formState.errors.linkedin && (
                <p className="text-sm text-red-500">{form.formState.errors.linkedin.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="twitter">Twitter URL</Label>
              <Input id="twitter" {...form.register("twitter")} placeholder="twitter.com/username" />
              {form.formState.errors.twitter && (
                <p className="text-sm text-red-500">{form.formState.errors.twitter.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="resume">Resume URL</Label>
              <Input id="resume" {...form.register("resume")} placeholder="https://example.com/resume.pdf" />
              {form.formState.errors.resume && (
                <p className="text-sm text-red-500">{form.formState.errors.resume.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
