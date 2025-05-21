"use client";
import StatusBadge from "@/components/common/StatusBadge";
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
import { useDeleteCookie, useGetCookie } from "@/hooks/useCookie";
import { Loader2, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CookieDialog({
  isStatusLoading,
  status,
  provider,
  onSave,
}: {
  isStatusLoading: boolean;
  status: boolean;
  provider: string;
  onSave?: (cookies: any[]) => void;
}) {
  const [cookieText, setCookieText] = useState("");
  const { data: cookies, isLoading } = useGetCookie(provider);
  const { mutate: deleteCookie, isPending: isDeletePending } =
    useDeleteCookie();

  useEffect(() => {
    if (cookies) {
      setCookieText(JSON.stringify(cookies?.data?.cookies, null, 2));
    }
  }, [cookies]);

  const handleSave = () => {
    try {
      const cookies = JSON.parse(cookieText);
      onSave?.(cookies);
    } catch (error) {
      toast.error("Invalid cookie format. Please check your input.");
    }
  };

  const handleDelete = () => {
    deleteCookie({ provider });
    setCookieText("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`flex flex-row items-center justify-between gap-2 w-full h-[60px] ${
            isStatusLoading ? "opacity-50" : ""
          }`}
        >
          {provider}
          {isStatusLoading ? (
            <Loader2 className="animate-spin size-3" />
          ) : (
            <StatusBadge
              color={status ? "bg-emerald-500" : "bg-red-500"}
              text={status ? "Added" : "Empty"}
            />
          )}
        </Button>
      </DialogTrigger>
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
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={isDeletePending}
            >
              {isDeletePending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash className="w-4 h-4 text-red-500" />
              )}
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isLoading || isDeletePending}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save Cookies"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
