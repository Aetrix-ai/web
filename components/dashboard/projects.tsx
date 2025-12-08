import { FolderGit2, Plus, ExternalLink, Github, Box } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Project } from "./types"

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">My Projects</h2>
          <p className="text-sm text-muted-foreground">Showcase your best work.</p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.title} className="flex flex-col overflow-hidden transition-all hover:shadow-md group">
            <div className="relative h-48 w-full overflow-hidden border-b bg-muted/50">
                {project.image ? (
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
                 <Badge variant={project.status === 'live' ? 'default' : 'secondary'} className="capitalize">
                    {project.status}
                 </Badge>
              </div>
              <CardTitle className="line-clamp-1">{project.title}</CardTitle>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10">
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
                {project.sandbox && (
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={project.sandbox} target="_blank" rel="noreferrer">
                      <Box className="mr-2 size-3" /> Sandbox
                    </a>
                  </Button>
                )}
                {!project.demoLink && !project.repoLink && !project.sandbox && (
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
  )
}
