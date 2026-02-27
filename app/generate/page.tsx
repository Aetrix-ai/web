'use client'
import { Chatbox } from "@/components/generate/chatbox"
import { Preview } from "@/components/generate/preview"
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function GeneratePageContent() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const searchParams = useSearchParams();
  const [projectType, setProjectType] = useState<string>("none");
  useEffect(() => {
    let type = searchParams.get('type');
    console.log("from page loaded type is" , type)
    if (!type) {
      type = "play-ground"
    }
    setProjectType(type);
  }, [searchParams]);

  return (
    <div className="flex h-screen flex-col p-4 md:flex-row bg-background">
      {/* Left side - Chatbox (1 part) */}
      <div className="w-full md:w-1/4 h-1/3 md:h-full min-w-[300px]">
        <Chatbox
          LoadPreview={setIframeLoaded}
          projectType={projectType}
          className="h-full rounded-b-none border-b-0 md:rounded-b-xl md:border-b md:rounded-r-none md:border-r-0"
        />
      </div>

      {/* Right side - Preview (3 parts) */}
      <div className="w-full md:w-3/4 h-2/3 md:h-full">
        <Preview iframeLoaded={iframeLoaded} projectType={projectType} setIframeLoaded={setIframeLoaded} className="h-full rounded-t-none md:rounded-t-xl md:rounded-l-none" />
      </div>
    </div>
  )
}

export default function GeneratePage() {
  return (
    <Suspense>
      <GeneratePageContent />
    </Suspense>
  )
}

