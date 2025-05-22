"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

interface CpuChartProps {
  data: SystemData[] | null | undefined;
}

const chartConfig = {
  cpu: {
    label: "CPU Usage",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function CpuChart({ data }: CpuChartProps) {
  const validData = Array.isArray(data) ? data : [];

  const chartData = validData.map((item, index) => ({
    time: index,
    cpu: item.cpu,
  }));

  const latestCpu = validData[validData.length - 1]?.cpu ?? 0;
  const previousCpu = validData[validData.length - 2]?.cpu ?? 0;
  const cpuChange = ((latestCpu - previousCpu) / previousCpu) * 100;

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>CPU Usage</CardTitle>
        <CardDescription>Real-time CPU utilization</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={() => ""}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="cpu"
              type="natural"
              fill="var(--color-chart-1)"
              fillOpacity={0.4}
              stroke="var(--color-chart-1)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {cpuChange > 0 ? "Trending up" : "Trending down"} by{" "}
              {Math.abs(cpuChange).toFixed(1)}%
              <TrendingUp
                className={`h-4 w-4 ${cpuChange < 0 ? "rotate-180" : ""}`}
              />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Current Usage: {latestCpu.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
