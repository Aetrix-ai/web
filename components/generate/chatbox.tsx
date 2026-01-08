"use client";
import * as React from "react";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { apiClient, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageInput } from "../ui/message-input";
import { MessageList } from "../ui/message-list";
import { resolve } from "path";

export function Chatbox({ className }: React.ComponentProps<"div">) {
  const [prompt, setPrompt] = React.useState<string>("");
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const [messages, setMessages] = React.useState<
    {
      id: string;
      role: "assistant" | "user";
      content: string;
    }[]
  >([
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

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userMessage = {
      id: `${messages.length + 1}`,
      content: prompt,
      role: "user" as const,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setPrompt("");

    try {
      async function sendMessage() {
        // get token from local storage
        const token = localStorage.getItem("token");
        // const res = await apiClient.post(
        //   "/ai/chat",
        //   {
        //     prompt: "I need a dashboard layout with a sidebar.",
        //   },
        //   {
        //     headers: { Authorization: token },
        //   }
        // );

        // mocking behavior
        setIsGenerating(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const res = {
          data: `# Hello World

This is a paragraph with **bold** and *italic* text.

## Lists
- Item 1
- Item 2
  - Nested item

## Code
\`\`\`tsx
console.log("Hello World")
\`\`\`

## Tables
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`,
        };
        console.log("Response from AI chat:", res.data);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: `${prevMessages.length + 1}`,
            content: res.data,
            role: "assistant" as const,
          },
        ]);
        setIsGenerating(false);
      }

      sendMessage();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };
  return (
    <Card className={cn("flex p-0 flex-col h-full justify-between", className)}>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        <MessageList messages={messages} isTyping={false} />
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
            placeholder="Type your message..."
            className="focus:border-none focus:ring-0"
          />
        </CardFooter>
      </form>
    </Card>
  );
}
