import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, HardDrive, Network } from "lucide-react";
import { SystemData } from "@/types";

const MobileChart = ({ latestStats }: { latestStats: SystemData }) => {
  return (
    <div className="grid gap-4 grid-cols-2">
      <Card className="col-span-2 rounded-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestStats?.cpu.toFixed(1)}%
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-1 rounded-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestStats?.memory.percent.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {(latestStats?.memory.used / (1024 * 1024 * 1024)).toFixed(2)} GB
            used
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-1 rounded-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Network Traffic</CardTitle>
          <Network className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Received</p>
              <p className="text-sm font-medium">
                {(latestStats?.network.rx / (1024 * 1024)).toFixed(2)} MB/s
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Transmitted</p>
              <p className="text-sm font-medium">
                {(latestStats?.network.tx / (1024 * 1024)).toFixed(2)} MB/s
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileChart;
