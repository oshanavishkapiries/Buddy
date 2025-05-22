import React, { useEffect, useState } from "react";
import CpuChart from "./CpuChart";
import NetworkChart from "./NetworkChart";
import MemoryChart from "./MemoryChart";
import { useSocketIoClient } from "@/hooks/useSocketIoClient";
import { SystemData } from "@/types";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileChart from "./MobileChart";

const Metrics = () => {
  const clientSocket = useSocketIoClient();
  const [stats, setStats] = useState<SystemData[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (clientSocket) {
      clientSocket.subscribe("server-stats", (data: SystemData) => {
        setStats((prevStats) => {
          const newStats = [...prevStats, data];
          return newStats.slice(-60);
        });
      });
    }
  }, [clientSocket]);

  const latestStats = stats[stats.length - 1];

  return (
    <>
      {stats.length > 2 ? (
        <>
          {isMobile ? (
            <MobileChart latestStats={latestStats} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 z-0">
              <CpuChart data={stats} />
              <MemoryChart data={stats} />
              <NetworkChart data={stats} />
            </div>
          )}
        </>
      ) : (
        <div className="dark bg-muted text-foreground px-4 py-3">
          <div className="flex gap-2">
            <div className="flex grow gap-3">
              <Loader2
                className="mt-0.5 shrink-0 opacity-60 text-emerald-500 font-bold animate-spin"
                size={16}
                aria-hidden="true"
              />
              <div className="flex grow flex-col">
                <p className="text-sm">Collecting data...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Metrics;
