"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MessageInput } from "../ui/message-input";
import { MessageList } from "../ui/message-list";

function useChatStream(LoadPreview: React.Dispatch<React.SetStateAction<boolean>>) {
  const [messages, setMessages] = React.useState<
    {
      id: string;
      role: "assistant" | "user";
      content: string;
    }[]
  >([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const controllerRef = React.useRef<AbortController | null>(null);

  const startChat = async (prompt: string) => {
    const userMessageId = `${Date.now()}-user`;
    const assistantMessageId = `${Date.now()}-assistant`;

    // 1️⃣ Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        role: "user",
        content: prompt,
      },
      {
        id: assistantMessageId,
        role: "assistant",
        content: "", // placeholder for streaming
      },
    ]);

    setIsGenerating(true);
    controllerRef.current = new AbortController();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: token }),
        },
        body: JSON.stringify({ prompt }),
        signal: controllerRef.current.signal,
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          if (!part.startsWith("data:")) continue;
          const payload = part.replace("data:", "").trim();
          if (payload === "END") {
            setIsGenerating(false);
            return;
          }
          let parsed;
          try {
            parsed = JSON.parse(payload);
            console.log("Parsed payload:", parsed);
            const writetools = [
              "filesystem-create_directory",
              "filesystem-edit_file",
              "filesystem-move_file",
              "filesystem-write_file",
            ];
            if (parsed.type === "tools") {
              for (const tool of writetools) {
                if (parsed.text.includes(tool)) {
                  console.log("==============");
                  console.log("==============");
                  console.log("==============");
                  console.log("==============");
                  console.log("Tool usage detected, reloading preview...");
                  LoadPreview(false);
                }
              }
            }
          } catch {
            continue;
          }

          if (!parsed.text || parsed.text.length === 0) continue;

          assistantContent += parsed.text;

          setMessages((prev) =>
            prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: assistantContent } : msg))
          );
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Chat aborted");
      } else {
        console.error("Chat stream error:", err);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.role === "assistant" && msg.content === ""
              ? {
                  ...msg,
                  content: "Sorry, something went wrong. Please try again.",
                }
              : msg
          )
        );
      }
    } finally {
      setIsGenerating(false);
      LoadPreview(true);
    }
  };

  const stopChat = () => {
    controllerRef.current?.abort();
    setIsGenerating(false);
  };

  return { messages, setMessages, isGenerating, startChat, stopChat };
}

export function Chatbox({
  className,
  LoadPreview,
}: {
  className?: string;
  LoadPreview: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [prompt, setPrompt] = React.useState<string>("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const { messages, setMessages, isGenerating, startChat, stopChat } = useChatStream(LoadPreview);

  // Initialize with welcome messages
  React.useEffect(() => {
    setMessages([
      {
        id: "1",
        role: "user",
        content: "Hello, how are you?",
      },
      {
        id: "2",
        role: "assistant",
        content: "I'm doing well, thank you for asking!",
      },
    ]);
  }, [setMessages]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    const currentPrompt = prompt;
    setPrompt("");
    startChat(currentPrompt);
  };

  return (
    <Card className={cn("flex p-0 flex-col h-full justify-between", className)}>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        <MessageList messages={messages} isTyping={isGenerating} />
        <div ref={messagesEndRef} />
      </CardContent>
      <form action="" onSubmit={handleSubmit} className="w-full">
        <CardFooter className="pt-0 p-2">
          <MessageInput
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            submitOnEnter={true}
            enableInterrupt={true}
            isGenerating={isGenerating}
            stop={stopChat}
            placeholder="Type your message..."
            className="focus:border-none focus:ring-0"
          />
        </CardFooter>
      </form>
    </Card>
  );
}
