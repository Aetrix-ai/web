import * as React from "react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Preview({ className }: React.ComponentProps<"div">) {
  return (
    <Card className={cn("flex flex-col h-full overflow-hidden", className)}>
      <CardHeader className="px-4 py-3 border-b bg-muted/40">
        <CardTitle className="text-md font-normal flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="ml-2 text-muted-foreground text-xs">Preview</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 bg-background relative">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-sm">Generated content will appear here</p>
            <p className="text-xs opacity-70">React Sandbox / Code Preview</p>
          </div>
        </div>
        {/* Iframe or Sandbox would go here */}
        {/* <iframe src="..." className="w-full h-full border-0" /> */}
      </CardContent>
    </Card>
  )
}
