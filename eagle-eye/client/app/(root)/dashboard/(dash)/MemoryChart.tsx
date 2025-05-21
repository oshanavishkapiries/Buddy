"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

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

interface MemoryChartProps {
  data: SystemData[] | null | undefined;
}

const chartConfig = {
  used: {
    label: "Used Memory",
    color: "hsl(var(--chart-1))",
  },
  free: {
    label: "Free Memory",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function MemoryChart({ data }: MemoryChartProps) {
  const validData = Array.isArray(data) ? data : [];
  const latestData = validData[validData.length - 1];

  const chartData = React.useMemo(() => {
    if (!latestData) return [];

    const used = latestData.memory.used;
    const free = latestData.memory.total - used;

    return [
      {
        type: "used",
        value: used,
        fill: "var(--color-chart-1)",
      },
      {
        type: "free",
        value: free,
        fill: "var(--color-chart-2)",
      },
    ];
  }, [latestData]);

  const totalMemory = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Memory Usage</CardTitle>
        <CardDescription>Real-time system memory</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {latestData?.memory.percent.toFixed(1)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Used
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total Memory: {(totalMemory / (1024 * 1024 * 1024)).toFixed(2)} GB
        </div>
        <div className="leading-none text-muted-foreground">
          Showing current memory usage
        </div>
      </CardFooter>
    </Card>
  );
}
