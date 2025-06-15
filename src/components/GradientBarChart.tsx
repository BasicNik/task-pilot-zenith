
import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/**
 * Props:
 *  data: { date: string, completed: number }[]
 *  height?: number
 */
type DataPoint = {
  date: string;
  completed: number;
};

interface GradientBarChartProps {
  data: DataPoint[];
  height?: number;
}

const GradientBarChart: React.FC<GradientBarChartProps> = ({ data, height = 340 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fd6a6a" />    {/* bright magenta/orange */}
            <stop offset="70%" stopColor="#da4af7" />    {/* purple */}
            <stop offset="100%" stopColor="#3661fa" />   {/* blue-ish */}
          </linearGradient>
          {/* Soft glow filter */}
          <filter id="glow" height="300%" width="200%" x="-50%" y="-100%">
            <feGaussianBlur stdDeviation="7.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="2 3" vertical={false} />
        <XAxis 
          dataKey="date"
          tick={{ fill: "#bdbdbd", fontSize: 14 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          allowDecimals={false}
          tick={{ fill: "#bdbdbd", fontSize: 14 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(26,22,36,0.92)",
            color: "#fff",
            borderRadius: 12,
            border: "none",
            boxShadow: "0 2px 15px 0 #da4af7"
          }}
          labelStyle={{ color: "#fd6a6a", fontWeight: "bold" }}
          cursor={{ fill: "rgba(218,74,247,0.09)" }}
          formatter={(val: any) => [val, "Tasks"]}
          separator=": "
        />
        <Bar
          dataKey="completed"
          fill="url(#gradientBar)"
          barSize={38}
          radius={[14, 14, 0, 0]}
        >
          {data.map((_, idx) => (
            <Cell key={`cell-${idx}`} filter="url(#glow)" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GradientBarChart;

