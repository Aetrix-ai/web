import { Sparkles, Mail, Github, Linkedin, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { User } from "./types"

export function UserDetails({ user }: { user: User }) {
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div className="h-32 bg-linear-to-r from-primary/20 to-primary/5" />
      <CardContent className="relative pt-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-12 px-2">
            <img src={user.avatar} alt="Profile picture" className="size-24 rounded-full border-4 border-background shadow-sm bg-background object-cover" />
            <div className="flex-1 mt-4 sm:mt-14 space-y-1 w-full text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 text-sm">
                            <Mail className="size-3" /> {user.email}
                        </p>
                    </div>
                    <Button>Edit Profile</Button>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                    <Badge variant="secondary" className="gap-1">
                        <Sparkles className="size-3" /> {user.role}
                    </Badge>
                    <Badge variant="outline">Computer Science</Badge>
                </div>
            </div>
        </div>

        <div className="mt-8 px-2 grid gap-6">
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                    {user.bio || "No bio provided."}
                </p>
            </div>

            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Connect</h3>
                <div className="flex flex-wrap gap-3">
                    {user.github && (
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                            <a href={`https://${user.github}`} target="_blank" rel="noreferrer">
                                <Github className="size-4" /> GitHub
                            </a>
                        </Button>
                    )}
                    {user.linkedin && (
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                            <a href={`https://${user.linkedin}`} target="_blank" rel="noreferrer">
                                <Linkedin className="size-4" /> LinkedIn
                            </a>
                        </Button>
                    )}
                    {user.twitter && (
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                            <a href={`https://${user.twitter}`} target="_blank" rel="noreferrer">
                                <Twitter className="size-4" /> Twitter
                            </a>
                        </Button>
                    )}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
