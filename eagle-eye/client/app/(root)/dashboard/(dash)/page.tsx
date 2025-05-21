"use client";
import { useSocketIoClient } from "@/hooks/useSocketIoClient";
import React, { useEffect, useState } from "react";
import CpuChart from "./CpuChart";
import NetworkChart from "./NetworkChart";
import MemoryChart from "./MemoryChart";

interface SystemData {
  cpu: number;
  memory: {
    total: number;
    used: number;
    percent: number;
  };
  network: {
    rx: number;
    tx: number;
  };
}

const DashBoardPage = () => {
  const clientSocket = useSocketIoClient();
  const [stats, setStats] = useState<SystemData[]>([]);

  useEffect(() => {
    if (clientSocket) {
      clientSocket.subscribe("server-stats", (data: SystemData) => {
        setStats((prevStats) => {
          const newStats = [...prevStats, data];
          return newStats.slice(-10);
        });
      });
    }
  }, [clientSocket]);

  return (
    <div className="w-full h-full">
      {
        stats.length > 2 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 z-0">
          <CpuChart data={stats} />
          <MemoryChart data={stats} />
          <NetworkChart data={stats} />
        </div>
      ) : (
        <div className="flex justify-center items-center rounded-lg w-full h-[350px] bg-foreground/5 animate-pulse">
        </div>
      )}
    </div>
  );
};

export default DashBoardPage;
