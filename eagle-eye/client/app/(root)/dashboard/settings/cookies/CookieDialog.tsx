"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function CookieDialog({
  children,
  provider,
  onSave,
}: {
  children: React.ReactNode;
  provider: string;
  onSave?: (cookies: string) => void;
}) {
  const [cookieText, setCookieText] = useState("");

  const handleSave = () => {
    console.log("Raw cookie text:", cookieText);
    onSave?.(cookieText);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Cookies for {provider}</DialogTitle>
          <DialogDescription>Paste your cookies data here</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={cookieText}
            onChange={(e) => setCookieText(e.target.value)}
            placeholder="Paste your cookies data here..."
            className="min-h-[150px] font-mono text-sm"
          />
          <div className="flex justify-end">
            <Button type="button" onClick={handleSave}>
              Save Cookies
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
