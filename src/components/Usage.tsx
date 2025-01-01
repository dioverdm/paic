"use client";

import { useState } from "react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  //   Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Sample data for AI usage
const todayData = [
  { time: "00:00", openai: 100, openrouter: 80, anthropic: 60 },
  { time: "06:00", openai: 150, openrouter: 120, anthropic: 90 },
  { time: "12:00", openai: 200, openrouter: 160, anthropic: 120 },
  { time: "18:00", openai: 180, openrouter: 140, anthropic: 100 },
  { time: "23:59", openai: 220, openrouter: 180, anthropic: 140 },
];

const thisWeekData = [
  { day: "Mon", openai: 700, openrouter: 550, anthropic: 400 },
  { day: "Tue", openai: 800, openrouter: 600, anthropic: 450 },
  { day: "Wed", openai: 900, openrouter: 700, anthropic: 550 },
  { day: "Thu", openai: 1000, openrouter: 800, anthropic: 600 },
  { day: "Fri", openai: 1100, openrouter: 900, anthropic: 700 },
  { day: "Sat", openai: 950, openrouter: 750, anthropic: 550 },
  { day: "Sun", openai: 850, openrouter: 650, anthropic: 500 },
];

export default function AIUsageGraph() {
  const [timePeriod, setTimePeriod] = useState("today");

  const data = timePeriod === "today" ? todayData : thisWeekData;
  const xAxisKey = timePeriod === "today" ? "time" : "day";

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>AI Usage Graph</CardTitle>
        <CardDescription>
          Usage comparison for OpenAI, OpenRouter, and Anthropic
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ChartContainer
          config={{
            openai: {
              label: "OpenAI",
              color: "hsl(var(--chart-1))",
            },
            openrouter: {
              label: "OpenRouter",
              color: "hsl(var(--chart-2))",
            },
            anthropic: {
              label: "Anthropic",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="openai"
                stroke="var(--color-openai)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="openrouter"
                stroke="var(--color-openrouter)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="anthropic"
                stroke="var(--color-anthropic)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
