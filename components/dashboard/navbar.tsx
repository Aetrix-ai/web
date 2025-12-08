"use client"

import type { ComponentType } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type NavItem = {
  id: string
  label: string
  icon: ComponentType<{ className?: string }>
}

interface NavbarProps {
  items: NavItem[]
  activeTab: string
  onTabChange: (id: string) => void
}

export function Navbar({ items, activeTab, onTabChange }: NavbarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-2 border-r bg-card/50 p-4 lg:flex h-screen sticky top-0">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <div className="h-4 w-4 rounded-sm bg-primary" />
        </div>
        <span className="text-lg font-semibold tracking-tight">Portfolio</span>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeTab === id ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-3 px-3 font-medium transition-all",
              activeTab === id
                ? "bg-primary/10 text-primary hover:bg-primary/15"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onTabChange(id)}
          >
            <Icon className="size-4" />
            {label}
          </Button>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="rounded-lg border bg-background p-4">
          <h4 className="mb-2 text-sm font-medium">Pro Plan</h4>
          <p className="mb-3 text-xs text-muted-foreground">
            Upgrade to unlock advanced analytics and custom domains.
          </p>
          <Button size="sm" className="w-full" variant="outline">
            Upgrade
          </Button>
        </div>
      </div>
    </aside>
  )
}
