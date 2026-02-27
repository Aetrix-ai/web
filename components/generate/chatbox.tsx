"use client";
import * as React from "react";
import {
  apiClientWithAuth,
  AVIALBLE_MODELS,
  cn,
  FULL_AI_API_URL,
} from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MessageInput } from "../ui/message-input";
import { MessageList } from "../ui/message-list";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function useChatStream(
  LoadPreview: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const [messages, setMessages] = React.useState<
    {
      id: string;
      role: "assistant" | "user";
      content: string;
    }[]
  >([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const controllerRef = React.useRef<AbortController | null>(null);

  //@ts-ignore
  const wraptools = (tool: any) => {
    function getWrapTools(
      toolName: string,
      message: string,
      status: "success" | "error" = "error",
    ) {
      let name = toolName.split("-").pop() || toolName;
      name = name.replace(/_/g, " ");
      name = name.charAt(0).toUpperCase() + name.slice(1);

      if (status === "success") {
        return `> ✓⃝ **\`${name}\`**`;
      }

      // add line break for each
      return `> ❗ **\`${name}\`** `;
    }
    const name = tool.name;
    const content = tool.content;

    if (!name || !content) {
      console.warn("Tool missing name or content:", tool);
      return "";
    }

    if (tool.status === "success") {
      return getWrapTools(name, content, "success") + "\n";
    } else {
      return getWrapTools(name, content, "error") + "\n";
    }
  };
  const startChat = async (prompt: string, modelName: string) => {
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

      const res = await fetch(FULL_AI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: token }),
        },
        body: JSON.stringify({ prompt, modelName }),
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
          const parsed = JSON.parse(part.replace("data:", ""));
          //continude if parsed is empty or not an object
          if (
            !parsed ||
            typeof parsed !== "object" ||
            Object.keys(parsed).length === 0
          ) {
            console.warn("Received non-object chunk:", parsed);
            continue;
          }
          if (parsed.model_request) {
            const content = parsed.model_request[0].kwargs.content;
            if (typeof content !== "string") continue;
            assistantContent += content;
            console.log("Parsed content chunk:", content);
            assistantContent += "\n";
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: assistantContent }
                  : msg,
              ),
            );
          } else if (parsed.tools) {
            for (const tool of parsed.tools) {
              console.log("Tool kwargs:", tool.kwargs);
              assistantContent += "\n";
              assistantContent += wraptools(tool.kwargs);
              assistantContent += "\n";

              // Add line break after each tool
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: assistantContent }
                    : msg,
                ),
              );
            }
          }
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
              : msg,
          ),
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
  projectType,
}: {
  className?: string;
  LoadPreview: React.Dispatch<React.SetStateAction<boolean>>;
  projectType?: string | null;
}) {
  const [prompt, setPrompt] = React.useState<string>("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const [models, setModels] = React.useState<string[]>([]);
  const [model, setModel] = React.useState("");

  async function getAvialableModels() {
    try {
      const res = await apiClientWithAuth().get(AVIALBLE_MODELS);
      console.log(res.data);
      const avl_models = res.data.models as string[];
      const defaultModel = res.data.default;
      console.log(avl_models , defaultModel)
      setModels(avl_models);
      setModel(defaultModel);
    } catch (e: any) {
      console.log(e);
    }
  }

  const { messages, setMessages, isGenerating, startChat, stopChat } =
    useChatStream(LoadPreview);

  // Initialize with welcome messages
  React.useEffect(() => {
    const welcomeContent =
      projectType === "portfolio"
        ? "Hey! Let's build your **portfolio website**. Tell me about yourself — your skills, projects, and what you'd like to showcase!"
        : projectType === "custom"
          ? "Hey! Let's build your **custom web application**. What would you like to create today?"
          : "Hey, how can I help you!";

    setMessages([
      {
        id: "2",
        role: "assistant",
        content: welcomeContent,
      },
    ]);

    getAvialableModels();
  }, [setMessages, projectType]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    const currentPrompt = prompt;
    setPrompt("");
    startChat(currentPrompt, model);
  };

  return (
    <Card className={cn("flex p-0 flex-col h-full justify-between", className)}>
      <div className="flex w-full justify-end ">
        <Select
          value={model}
          onValueChange={(value) => {
            setModel(value);
          }}
        >
          <SelectTrigger className="w-full m-1">
            <SelectValue placeholder="model" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              {models.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
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

/**
     * [
    {
        "lc": 1,
        "type": "constructor",
        "id": [
            "langchain_core",
            "messages",
            "ToolMessage"
        ],
        "kwargs": {
            "status": "success",
            "content": "Allowed directories:\n/home/user/e2b_scripts/play-ground",
            "artifact": [],
            "tool_call_id": "toolu_01RbaydXY1X1FbNPaLuy1QJx",
            "name": "filesystem-list_allowed_directories",
            "metadata": {},
            "additional_kwargs": {},
            "response_metadata": {},
            "id": "92d78a4c-beb3-400b-8d9e-4bd13defebdb"
        }
    }


]
     */

//wrap it in a md code block for better display
