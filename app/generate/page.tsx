import { Chatbox } from "@/components/generate/chatbox"
import { Preview } from "@/components/generate/preview"

export default function GeneratePage() {
  return (
    <div className="flex h-screen flex-col md:flex-row bg-background">
      {/* Left side - Chatbox (1 part) */}
      <div className="w-full md:w-1/4 h-1/3 md:h-full min-w-[300px]">
        <Chatbox className="h-full border-0 rounded-none border-b md:border-b-0 md:border-r" />
      </div>

      {/* Right side - Preview (3 parts) */}
      <div className="w-full md:w-3/4 h-2/3 md:h-full">
        <Preview className="h-full border-0 rounded-none" />
      </div>
    </div>
  )
}

