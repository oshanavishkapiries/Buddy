import { Button } from "@/components/ui/button";
import { CirclePlus, Cookie } from "lucide-react";
import React from "react";
import CookieDialog from "./CookieDialog";

const CookiesPage = () => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="dark bg-muted text-foreground px-4 py-3">
        <div className="flex gap-2 md:items-center">
          <div className="flex grow gap-3 md:items-center">
            <div
              className="bg-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5"
              aria-hidden="true"
            >
              <Cookie className="opacity-80" size={16} />
            </div>
            <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Manage your cookies here.</p>
                <p className="text-muted-foreground text-sm">
                  Your cookies are securely stored and encrypted. We prioritize
                  your privacy and data security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        <CookieDialog provider="Intergram">
          <Button variant="outline" className="flex flex-row gap-2">
            Intergram
            <CirclePlus />
          </Button>
        </CookieDialog>
      </div>
    </div>
  );
};

export default CookiesPage;
