"use client";

import { useState } from "react";
import { FolderGit2, Plus, ExternalLink, Github, Box, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ProjectDialog } from "./project-dialog";
import { Project } from "./types";

async function fetchProjects() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const res = await apiClient.get("user/profile/projects", {
    headers: { authorization: token || "" },
  });
  return res.data.projects;
}

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: fetchProjects,
  });

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
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

      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        project={selectedProject}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((project: Project) => (
          <Card key={project.id || project.title} className="flex flex-col overflow-hidden transition-all hover:shadow-md group relative">
             <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" onClick={() => handleEdit(project)}>
                  <Edit className="size-4" />
                </Button>
             </div>
            <div className="relative h-48 w-full overflow-hidden border-b bg-muted/50">
              {project.images && project.images.length > 0 ? (
                <img
                  src={project.images[0]}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : project.image ? (
                 <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <FolderGit2 className="size-10 text-muted-foreground/50" />
                </div>
              )}
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
