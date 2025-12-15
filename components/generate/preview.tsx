"use client";
import * as React from "react";

import { apiClient, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";

export function Preview({ className }: React.ComponentProps<"div">) {
  const [id, setID] = React.useState<string | null>(null);
  const [view, setView] = React.useState<8080 | 5173>(5173);
  function handleToggle() {
    if (view === 5173) {
      setView(8080);
    } else {
      setView(5173);
    }
  }
  React.useEffect(() => {
    async function getSandboxUrl(projectId: number) {
      try {
        const token = localStorage.getItem("token");

        const response = await apiClient.post(
          "/sandbox",
          {},
          {
            headers: { Authorization: token },
          }
        );

        sessionStorage.setItem("sandbox", response.data.sandboxId);
        setID(response.data.sandboxId);
      } catch (error) {
        console.error("Error fetching sandbox URL:", error);
        throw error;
      }
    }
    getSandboxUrl(1);
  }, []);
  return (
    <Card className={cn("flex flex-col p-0 h-full overflow-hidden", className)}>
      <div className="border-b fixed top-5 right-5">
        <Button size={"sm"} variant={"secondary"} onClick={handleToggle}>{view === 5173 ? "Code Preview" : "React Sandbox"}</Button>
      </div>
      {!id && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-sm">Generated content will appear here</p>
            <p className="text-xs opacity-70">React Sandbox / Code Preview</p>
          </div>
        </div>
      )}
      {/* Iframe or Sandbox would go here */}
      {/* <iframe src="..." className="w-full h-full border-0" /> */}
      {view === 5173
        ? id && <iframe src={`https://${5173}-${id}.e2b.app`} className="w-full h-full border-0" />
        : id && <iframe src={`https://${8080}-${id}.e2b.app`} className="w-full h-full border-0" />}
    </Card>
  );
}
