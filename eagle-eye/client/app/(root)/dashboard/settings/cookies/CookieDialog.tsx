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
import { useDeleteCookie, useGetCookie } from "@/hooks/useCookie";
import { Loader2, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function CookieDialog({
  children,
  provider,
  isLoading,
  isUpdateLoading,
  open,
  setOpen,
  onSave,
}: {
  children: React.ReactNode;
  provider: string;
  onSave?: (cookies: any[]) => void;
  isLoading?: boolean;
  isUpdateLoading?: boolean;
  open?: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [cookieText, setCookieText] = useState("");
  const { data: cookies } = useGetCookie(provider);
  const { mutate: deleteCookie, isPending: isDeletePending } = useDeleteCookie(setOpen);

  useEffect(() => {
    if (cookies) {
      setCookieText(JSON.stringify(cookies?.data?.cookies, null, 2));
    }
  }, [cookies, open]);

  const handleSave = () => {
    const cookies = JSON.parse(cookieText);
    onSave?.(cookies);
  };

  const handleDelete = () => {
    deleteCookie({ provider });
    setCookieText("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleDelete}>
              {isDeletePending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash className="w-4 h-4 text-red-500" />
              )}
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isLoading || isUpdateLoading}
            >
              {isLoading || isUpdateLoading ? (
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
