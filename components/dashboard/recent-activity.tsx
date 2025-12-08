import { Sparkles, Clock, CheckCircle2, FileEdit } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Activity } from "./types"

export function RecentActivity({ activities }: { activities: Activity[] }) {
  const getIcon = (status: Activity['status']) => {
      switch(status) {
          case 'done': return <CheckCircle2 className="size-4 text-primary" />
          case 'in-progress': return <Clock className="size-4 text-muted-foreground" />
          case 'draft': return <FileEdit className="size-4 text-muted-foreground" />
          default: return <Sparkles className="size-4" />
      }
  }

  const getBadgeVariant = (status: Activity['status']) => {
      switch(status) {
          case 'done': return 'default'
          case 'in-progress': return 'secondary'
          case 'draft': return 'outline'
          default: return 'secondary'
      }
  }

  return (
    <Card className="h-full border-none shadow-md">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates to your portfolio.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((item, i) => (
          <div key={i} className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0 border-muted">
            <div className="mt-1 bg-muted/50 p-2 rounded-full">
                {getIcon(item.status)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{item.title}</p>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
              </div>
              <div className="flex items-center gap-2">
                  <Badge variant={getBadgeVariant(item.status)} className="text-[10px] px-1.5 py-0 h-5 capitalize">
                      {item.status}
                  </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
