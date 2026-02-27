"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CreateNewDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type CreateOption = "portfolio" | "custom";

export function CreateNewDialog({ trigger, open: controlledOpen, onOpenChange }: CreateNewDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<CreateOption | null>(null);
  const router = useRouter();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const handleOptionSelect = (option: CreateOption) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (selectedOption === "portfolio") {
      // Navigate to generate page with portfolio context
      router.push("/generate?type=portfolio");
    } else if (selectedOption === "custom") {
      // Navigate to generate page with custom context
      router.push("/generate?custom");
    }
    setOpen(false);
    setSelectedOption(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOption(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>What do you want to create today?</DialogTitle>
          <DialogDescription>
            Choose between creating a portfolio website or a custom project
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-6">
          {/* Portfolio Option */}
          <button
            onClick={() => handleOptionSelect("portfolio")}
            className={cn(
              "group relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 p-6 transition-all hover:border-primary/50 hover:bg-primary/5",
              selectedOption === "portfolio"
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border bg-card"
            )}
          >
            <div
              className={cn(
                "flex size-16 items-center justify-center rounded-full transition-colors",
                selectedOption === "portfolio"
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary group-hover:bg-primary/20"
              )}
            >
              <Briefcase className="size-8" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Portfolio</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Create a professional portfolio website
              </p>
            </div>
            {selectedOption === "portfolio" && (
              <div className="absolute right-2 top-2 size-5 rounded-full bg-primary flex items-center justify-center">
                <svg
                  className="size-3 text-primary-foreground"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>

          {/* Custom Option */}
          <button
            onClick={() => handleOptionSelect("custom")}
            className={cn(
              "group relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 p-6 transition-all hover:border-primary/50 hover:bg-primary/5",
              selectedOption === "custom"
                ? "border-primary bg-primary/10 shadow-md"
                : "border-border bg-card"
            )}
          >
            <div
              className={cn(
                "flex size-16 items-center justify-center rounded-full transition-colors",
                selectedOption === "custom"
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary group-hover:bg-primary/20"
              )}
            >
              <Sparkles className="size-8" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Custom</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Build a custom web application
              </p>
            </div>
            {selectedOption === "custom" && (
              <div className="absolute right-2 top-2 size-5 rounded-full bg-primary flex items-center justify-center">
                <svg
                  className="size-3 text-primary-foreground"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleContinue} disabled={!selectedOption}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Made with Bob
