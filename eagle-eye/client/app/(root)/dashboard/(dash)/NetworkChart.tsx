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

interface NetworkChartProps {
  data: SystemData[] | null | undefined;
}

const chartConfig = {
  rx: {
    label: "Received",
    color: "hsl(var(--chart-3))",
  },
  tx: {
    label: "Transmitted",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function NetworkChart({ data }: NetworkChartProps) {
  // Ensure data is an array and has valid entries
  const validData = Array.isArray(data) ? data : [];
  const chartData = validData.map((d, index) => ({
    index,
    rx: d?.network?.rx ?? 0,
    tx: d?.network?.tx ?? 0,
  }));

  return (
    <Card className="rounded-sm">
      <CardHeader>
        <CardTitle>Network Traffic</CardTitle>
        <CardDescription>
          Showing network received and transmitted data
        </CardDescription>
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
              dataKey="index"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="rx"
              type="natural"
              fill="var(--color-chart-1)"
              fillOpacity={0.4}
              stroke="var(--color-chart-1)"
              stackId="a"
            />
            <Area
              dataKey="tx"
              type="natural"
              fill="var(--color-chart-2)"
              fillOpacity={0.4}
              stroke="var(--color-chart-2)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Network Traffic Overview <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Real-time network monitoring
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
