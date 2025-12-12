"use client";

import { Trophy, Calendar, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Achievement } from "./types";
import { apiClient } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { AchievementDialog } from "./achievement-dialog";
import { IKContext, IKImage } from "imagekitio-react";

const IMAGEKIT_PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "";
const IMAGEKIT_URL_ENDPOINT = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "";

async function fetchAchievements() {
  const res = await apiClient.get("user/profile/achievement", {
    headers: { Authorization: localStorage.getItem("token") || "" },
  });
  return res.data;
}

export function Achievements() {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["achievements"],
    queryFn: fetchAchievements,
  });

  const deleteMutation = useMutation({
    mutationFn: async (achievementId: number) => {
      const token = localStorage.getItem("token");
      await apiClient.delete(`/user/profile/achievements/${achievementId}`, {
        headers: { Authorization: token || "" },
      });
    },
    onSuccess: () => {
      toast.success("Achievement deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    },
    onError: () => {
      toast.error("Failed to delete achievement");
    },
  });

  const handleEdit = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsDialogOpen(true);
  };

  const handleDelete = (achievementId: number) => {
    setDeleteId(achievementId);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleAdd = () => {
    setSelectedAchievement(undefined);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (error) {
      toast.error("Failed to load achievements");
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
        <p>Failed to load achievements</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={handleAdd}>
          <Plus className="mr-2 size-4" /> Add Achievement
        </Button>
      </div>

      <AchievementDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} achievement={selectedAchievement} />

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the achievement.
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

      <div className="columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4">
        {data?.map((item: Achievement) => (
          <Card
            key={item.title}
            className="flex flex-col overflow-hidden transition-all hover:shadow-md group relative break-inside-avoid mb-4"
          >
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <Button variant="secondary" size="icon" onClick={() => handleEdit(item)}>
                <Edit className="size-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => item.id && handleDelete(item.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            {/* Image Preview */}
            {item.images && item.images.length > 0 && (
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <IKContext urlEndpoint={IMAGEKIT_URL_ENDPOINT} publicKey={IMAGEKIT_PUBLIC_KEY}>
                  <IKImage
                    src={item.images[0]}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </IKContext>
                {item.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    +{item.images.length - 1} more
                  </div>
                )}
              </div>
            )}

            <div className="flex items-start gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Trophy className="size-6" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{item.title}</h3>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 size-3" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </div>
            </div>
          </Card>
        ))}
        {(!data || data.length === 0) && (
          <div className="col-span-full flex h-32 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
            No achievements found
          </div>
        )}
      </div>
    </div>
  );
}
