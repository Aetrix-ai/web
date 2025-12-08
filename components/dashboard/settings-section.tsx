import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { SettingsItem } from "./types"

export function SettingsSection({ settings }: { settings: SettingsItem[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Account and privacy settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.map((item) => (
            <div key={item.title} className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  item.enabled ? "bg-primary" : "bg-input"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
                    item.enabled ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
