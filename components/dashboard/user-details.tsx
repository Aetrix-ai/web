"use client";

import { Sparkles, Mail, Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

import { EditProfileDialog } from "./edit-profile-dialog";

async function fetchUserData() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
  const res = await apiClient.get("/user/profile", {
    headers: { authorization: token || "" },
  });
  return res.data;
}

export function UserDetails() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserData,
  });

  useEffect(() => {
    if (isError) {
      // @ts-ignore
      const message = error?.response?.data?.message || error?.message || "Failed to load user data.";
      toast.error(message);
    }
  }, [isError, error]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-none shadow-md h-[400px] flex items-center justify-center">
        <Spinner className="size-8 text-primary" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="overflow-hidden border-none shadow-md h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Failed to load user profile</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div className="h-32 bg-linear-to-r from-primary/20 to-primary/5" />
      <CardContent className="relative pt-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-12 px-2">
          <img
            src={data?.avatar || "https://github.com/shadcn.png"}
            alt="Profile picture"
            className="size-24 rounded-full border-4 border-background shadow-sm bg-background object-cover"
          />
          <div className="flex-1 mt-4 sm:mt-14 space-y-1 w-full text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{data?.name}</h2>
                <p className="text-muted-foreground flex items-center justify-center sm:justify-start gap-2 text-sm">
                  <Mail className="size-3" /> {data?.email}
                </p>
              </div>
              <EditProfileDialog user={data} />
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="size-3" /> {data?.role || "User"}
              </Badge>
              <Badge variant="outline">Computer Science</Badge>
            </div>
          </div>
        </div>

        <div className="mt-8 px-2 grid gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{data?.bio || "No bio provided."}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {data?.github && (
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href={`${data?.github}`} target="_blank" rel="noreferrer">
                    <Github className="size-4" /> GitHub
                  </a>
                </Button>
              )}
              {data?.linkedin && (
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href={`${data?.linkedin}`} target="_blank" rel="noreferrer">
                    <Linkedin className="size-4" /> LinkedIn
                  </a>
                </Button>
              )}
              {data?.twitter && (
                <Button variant="outline" size="sm" className="gap-2" asChild>
                  <a href={`${data?.twitter}`} target="_blank" rel="noreferrer">
                    <Twitter className="size-4" /> Twitter
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
