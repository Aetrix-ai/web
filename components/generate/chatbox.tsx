"use client"

import * as React from "react"
import { Send } from "lucide-react"


import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function Chatbox({ className }: React.ComponentProps<"div">) {
  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-md">Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex flex-col gap-2">
          <div className="bg-muted p-3 rounded-lg max-w-[85%] self-start text-sm">
            Hello! How can I help you generate code today?
          </div>
          <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[85%] self-end text-sm">
            I need a dashboard layout with a sidebar.
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <form className="flex w-full items-center space-x-2" onSubmit={(e) => e.preventDefault()}>
          <Input type="text" placeholder="Type your message..." className="flex-1" />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
