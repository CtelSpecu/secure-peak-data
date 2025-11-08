"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { Shield } from "lucide-react";

export interface ConsumptionDataPoint {
  time: string;
  consumption: number;
  encrypted: boolean;
}

interface ConsumptionGraphProps {
  data: ConsumptionDataPoint[];
}

const ConsumptionGraph = ({ data }: ConsumptionGraphProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Energy Consumption Log
          </h2>
          <p className="text-sm text-muted-foreground">
            24-Hour Period with Encrypted Peak Markers
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-encrypted">
          <Shield className="w-4 h-4" />
          <span>Encrypted Peaks</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: "12px" }}
            label={{
              value: "kWh",
              angle: -90,
              position: "insideLeft",
              style: { fill: "hsl(var(--muted-foreground))" },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
          />
          <Line
            type="monotone"
            dataKey="consumption"
            stroke="hsl(var(--energy))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--energy))", r: 4 }}
          />
          {data.map((entry, index) =>
            entry.encrypted ? (
              <ReferenceDot
                key={index}
                x={entry.time}
                y={entry.consumption}
                r={8}
                fill="hsl(var(--encrypted))"
                stroke="hsl(var(--encrypted))"
                strokeWidth={2}
              />
            ) : null
          )}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ConsumptionGraph;
