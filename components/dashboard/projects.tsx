"use client";

import { useState, useEffect, useRef } from "react";
import { FolderGit2, Plus, ExternalLink, Github, Box, Edit, Trash2 } from "lucide-react";
import { IKContext, IKImage } from "imagekitio-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectDialog } from "./project-dialog";
import { Project } from "./types";

const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

function ProjectImageCarousel({ images, title }: { images: string[]; title: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: currentIndex * width,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  return (
    <div ref={scrollRef} className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
      {images.map((img, idx) => (
        <div key={idx} className="w-full h-full shrink-0 snap-center">
          <IKImage
            src={img}
            alt={`${title} ${idx + 1}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}

async function fetchProjects() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const res = await apiClient.get("user/profile/projects", {
    headers: { authorization: token || "" },
  });
  return res.data;
}

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const deleteMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const token = localStorage.getItem("token");
      await apiClient.delete(`/user/profile/project/${projectId}`, {
        headers: { authorization: token || "" },
      });
    },
    onSuccess: () => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
  });

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleDelete = (projectId: number) => {
    setDeleteId(projectId);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleAdd = () => {
    setSelectedProject(undefined);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-none shadow-md h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="overflow-hidden border-none shadow-md h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Failed to load projects</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">My Projects</h2>
          <p className="text-sm text-muted-foreground">Showcase your best work.</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 size-4" /> Add Project
        </Button>
      </div>

      <ProjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} project={selectedProject} />

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the project.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.projects.map((project: Project) => (
          <Card
            key={project.id || project.title}
            className="flex flex-col overflow-hidden transition-all hover:shadow-md group relative"
          >
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <Button variant="secondary" size="icon" onClick={() => handleEdit(project)}>
                <Edit className="size-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => project.id && handleDelete(project.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="relative h-48 w-full overflow-hidden border-b bg-muted/50">
              <IKContext urlEndpoint={IMAGEKIT_URL_ENDPOINT} publicKey={IMAGEKIT_PUBLIC_KEY}>
                {project.images && project.images.length > 0 ? (
                  <ProjectImageCarousel images={project.images} title={project.title} />
                ) : project.image ? (
                  <IKImage
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <FolderGit2 className="size-10 text-muted-foreground/50" />
                  </div>
                )}
              </IKContext>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                {project.status && (
                  <Badge variant={project.status === "live" ? "default" : "secondary"} className="capitalize">
                    {project.status}
                  </Badge>
                )}
              </div>
              <CardTitle className="line-clamp-1">{project.title}</CardTitle>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/5 p-4">
              <div className="flex w-full gap-2">
                {project.demoLink && (
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={project.demoLink} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-2 size-3" /> Demo
                    </a>
                  </Button>
                )}
                {project.repoLink && (
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={project.repoLink} target="_blank" rel="noreferrer">
                      <Github className="mr-2 size-3" /> Code
                    </a>
                  </Button>
                )}
                {!project.demoLink && !project.repoLink && (
                  <Button variant="ghost" size="sm" className="w-full" disabled>
                    No links available
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
