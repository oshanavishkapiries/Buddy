"use client";

import SocketIoClient from "@/lib/socket-client";
import React, { createContext, useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";

interface SocketIoContextValue {
  socketIoClient: SocketIoClient | null;
  connected: boolean;
  isLoading: boolean;
}

interface Props {
  children: React.ReactNode;
}

export const socketIoContext = createContext<SocketIoContextValue>({
  socketIoClient: null,
  connected: false,
  isLoading: true,
});

export function ProvideSocketIoClient({ children }: Props) {
  const socketIo = useProvideSocketIoClient();

  useEffect(() => {
    return () => {
      if (socketIo?.client) {
        socketIo.client.disconnect();
      }
    };
  }, [socketIo]);

  return (
    <socketIoContext.Provider
      value={{
        socketIoClient: socketIo?.client || null,
        connected: socketIo?.connected || false,
        isLoading: socketIo?.isLoading || false,
      }}
    >
      {children}
    </socketIoContext.Provider>
  );
}

function useProvideSocketIoClient() {
  const clientRef = useRef<SocketIoClient | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  if (typeof window === "undefined") return;

  const url = process.env.NEXT_PUBLIC_API_URL || "";
  const token = Cookies.get("authToken");
  const config = {
    url: url,
    token: token,
  };

  if (!clientRef.current) {
    clientRef.current = new SocketIoClient(config);

    clientRef.current.on("connect", () => {
      setConnected(true);
      setIsLoading(false);
      console.log(
        "[CLIENT] Connected to server with ID:",
        clientRef.current?.userId
      );
    });

    clientRef.current.on("disconnect", () => {
      setConnected(false);
      console.log("[CLIENT] Disconnected from server");
    });
  }

  return { client: clientRef.current, connected, isLoading };
}
