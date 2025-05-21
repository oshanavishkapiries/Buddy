"use client";
import { Cookie } from "lucide-react";
import React from "react";
import CookieDialog from "./CookieDialog";
import { Provider } from "@/types";
import {
  useCreateCookie,
  useUpdateCookie,
  useGetCookiesProvider,
} from "@/hooks/useCookie";

const CookiesPage = () => {
  const { mutate: createCookie } = useCreateCookie();
  const { mutate: updateCookie } = useUpdateCookie();
  const { data: cookiesProvider, isLoading } = useGetCookiesProvider();

  const handleSave = (cookies: any[], provider: Provider) => {
    if (cookiesProvider?.data?.includes(provider)) {
      updateCookie({ provider: provider, cookies: cookies });
    } else {
      createCookie({ provider: provider, cookies: cookies });
    }
  };

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
        {Object.values(Provider).map((provider) => (
          <CookieDialog
            key={provider}
            provider={provider}
            status={cookiesProvider?.data?.includes(provider)}
            isStatusLoading={isLoading}
            onSave={(cookies) => handleSave(cookies, provider)}
          />
        ))}
      </div>
    </div>
  );
};

export default CookiesPage;
