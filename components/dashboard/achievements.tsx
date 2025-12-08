import { Trophy, Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
} from "@/components/ui/card"
import type { Achievement } from "./types"

export function Achievements({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Achievements</h2>
          <p className="text-sm text-muted-foreground">Milestones and awards you've earned.</p>
        </div>
        <Button>
          <Plus className="mr-2 size-4" /> Add Achievement
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {achievements.map((item) => (
          <Card key={item.title} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 transition-all hover:bg-muted/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Trophy className="size-6" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{item.title}</h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 size-3" />
                  {item.date}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
