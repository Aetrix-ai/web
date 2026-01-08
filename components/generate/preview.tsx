"use client";
import * as React from "react";

import { apiClient, cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { SiriLoading } from "@/components/ui/siri-loading";
import "./preview.css";

export function Preview({ className }: React.ComponentProps<"div">) {
  const [id, setID] = React.useState<string | null>(null);
  const [view, setView] = React.useState<8080 | 5173>(5173);
  const [iframeLoaded, setIframeLoaded] = React.useState(false);
  function handleToggle() {
    setIframeLoaded(false);
    if (view === 5173) {
      setView(8080);
    } else {
      setView(5173);
    }
  }
  React.useEffect(() => {
    async function getSandboxUrl() {
      try {
        const token = localStorage.getItem("token");
        // intialize sandbox
        const response = await apiClient.get("/ai/sandbox", {
          headers: { Authorization: token },
        });
        sessionStorage.setItem("sandbox", response.data.sandbox);
        setID(response.data.sandbox);

        console.log("Sandbox ID:", response.data.sandbox);
      } catch (error) {
        console.error("Error fetching sandbox URL:", error);
        throw error;
      }
    }
    getSandboxUrl();
  }, []);

  return (
    <div className={cn("relative h-full", !iframeLoaded && id && "p-1")}>
      {(!iframeLoaded || !id) && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 via-cyan-500 to-purple-500 rounded-lg animate-gradient-flow"></div>
      )}
      <Card className={cn("flex flex-col p-0 h-full overflow-hidden relative bg-background", className)}>
        <div className="absolute top-5 right-5 z-50">
          <Button size={"sm"} variant={"secondary"} onClick={handleToggle}>
            {view === 5173 ? "Code Preview" : "React Sandbox"}
          </Button>
        </div>

        {(!iframeLoaded || !id) && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-xl z-10">
            <SiriLoading />
          </div>
        )}
        {view === 5173
          ? id && (
              <iframe
                loading="eager"
                onLoad={() => setIframeLoaded(true)}
                src={`https://${5173}-${id}.e2b.app`}
                className="w-full h-full border-0"
              />
            )
          : id && (
              <iframe
                loading="eager"
                onLoad={() => setIframeLoaded(true)}
                src={`https://${8080}-${id}.e2b.app`}
                className="w-full h-full border-0"
              />
            )}
      </Card>
    </div>
  );
}
