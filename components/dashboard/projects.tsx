"use client";

import { useState, useEffect, useRef } from "react";
import { FolderGit2, Plus, ExternalLink, Github, Box, Edit, Trash2, Maximize2, PlayCircle } from "lucide-react";
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
import { apiClient, cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectDialog } from "./project-dialog";
import { Project } from "./types";

const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

function ProjectMediaViewer({ images = [], videos = [], title }: { images?: string[]; videos?: string[]; title: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mediaItems = [
    ...(images || []).map((url) => ({ type: "image" as const, url })),
    ...(videos || []).map((url) => ({ type: "video" as const, url })),
  ];

  useEffect(() => {
    if (mediaItems.length <= 1 || isZoomed || isHovered) return;

    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % mediaItems.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [mediaItems.length, isZoomed, isHovered]);

  if (mediaItems.length === 0) return null;

  const currentMedia = mediaItems[selectedIndex];

  return (
    <div
      className="flex flex-col h-full w-full group/container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Large Preview */}
      <div className="relative flex-1 w-full overflow-hidden group/media bg-muted/50">
        <div className="w-full h-full cursor-pointer" onClick={() => setIsZoomed(true)}>
          {currentMedia.type === "image" ? (
            <IKImage
              src={currentMedia.url}
              alt={`${title} ${selectedIndex + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover/media:scale-105"
            />
          ) : (
            <div className="relative h-full w-full bg-black flex items-center justify-center group-hover/media:scale-105 transition-transform duration-300">
              <video src={currentMedia.url} className="h-full w-full object-contain" muted playsInline />
              <PlayCircle className="absolute text-white/80 size-12 drop-shadow-lg" />
            </div>
          )}
        </div>

        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover/container:opacity-100 transition-opacity z-20 h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(true);
          }}
        >
          <Maximize2 className="size-4" />
        </Button>
      </div>

      {/* Thumbnails */}
      {mediaItems.length > 1 && (
        <div className="flex gap-1 p-1 overflow-x-auto  h-10 shrink-0 scrollbar-hide">
          {mediaItems.map((item, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex(idx);
              }}
              className={cn(
                "relative aspect-video h-full overflow-hidden rounded-sm border-2 shrink-0 transition-all",
                selectedIndex === idx
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              {item.type === "image" ? (
                <IKImage src={item.url} alt={`Thumbnail ${idx}`} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-black flex items-center justify-center">
                  <video src={item.url} className="h-full w-full object-cover" />
                  <PlayCircle className="absolute text-white/80 size-4" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-5xl w-full p-0 overflow-hidden bg-black border-none aspect-video sm:max-h-[80vh]">
          <div className="relative w-full h-full flex items-center justify-center">
            {currentMedia.type === "image" ? (
              <IKImage
                src={currentMedia.url}
                alt={`${title} full view`}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <video src={currentMedia.url} className="w-full h-full" controls autoPlay />
            )}
          </div>
        </DialogContent>
      </Dialog>
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
            <div className="relative h-72 w-full overflow-hidden ">
              <IKContext urlEndpoint={IMAGEKIT_URL_ENDPOINT} publicKey={IMAGEKIT_PUBLIC_KEY}>
                {(project.images?.length || 0) > 0 || (project.videos?.length || 0) > 0 ? (
                  <ProjectMediaViewer images={project.images} videos={project.videos} title={project.title} />
                ) : project.image ? (
                  <ProjectMediaViewer images={[project.image]} title={project.title} />
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
