import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import type { Task } from "./types";
import GradientBarChart from "./GradientBarChart";

// Define aurora palette color stops
const AURORA_GRADIENTS = [
  "#da4af7", // violet/pink
  "#fd6a6a", // bright red-orange
  "#fd8a4a", // orange
  "#FB697A", // magenta/red
  "#BC13FE", // purple
  "#E025BE", // magenta
  "#F4B5FD", // soft pink
];

const sampleTasks: Task[] = [
  {
    id: 1,
    title: "Finish TaskPilot UI",
    description: "Design and implement main workspace",
    dueDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    priority: "High",
    tags: ["frontend", "design"],
    status: "Completed",
  },
  {
    id: 2,
    title: "Write requirements doc",
    description: "Describe features and APIs",
    dueDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    priority: "Medium",
    tags: ["planning"],
    status: "Completed",
  },
  {
    id: 3,
    title: "Review pull request",
    description: "Check styling",
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    priority: "Low",
    tags: ["review"],
    status: "Pending",
  },
];

const auroraPieColors = [
  "#22c55e",     // green (Completed)
  "#fd8a4a",     // aurora orange (Pending)
];

const auroraBarColor = "#da4af7"; // aurora violet for bars

const Dashboard: React.FC = () => {
  // In real app, would get tasks from API or global state
  const tasks = sampleTasks;

  // Pie data
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = tasks.length - completed;

  const pieData = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  // Bar data (tasks completed per day, last 5 days)
  const today = new Date();
  const days = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(today.getTime() - (4 - i) * 86400000);
    // Format as dd-mm
    const label = `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const completedOnDay = tasks.filter(
      (t) =>
        t.status === "Completed" &&
        new Date(t.dueDate).toDateString() === d.toDateString()
    ).length;
    return { date: label, completed: completedOnDay };
  });

  return (
    <div className="flex flex-col md:flex-row gap-12 animate-fade-in">
      <section className="flex-1 flex flex-col items-center bg-card border rounded-lg shadow-lg p-5">
        <h2 className="text-2xl md:text-3xl font-bold aurora-text mb-2 text-center">
          Task Status
        </h2>
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <defs>
              <linearGradient id="aurora-pie-completed" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#BC13FE" />
              </linearGradient>
              <linearGradient id="aurora-pie-pending" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fd8a4a" />
                <stop offset="100%" stopColor="#da4af7" />
              </linearGradient>
            </defs>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={64}
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              <Cell key="Completed" fill="url(#aurora-pie-completed)" />
              <Cell key="Pending" fill="url(#aurora-pie-pending)" />
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>
      <section className="flex-1 flex flex-col items-center bg-card border rounded-lg shadow-lg p-5">
        <h2 className="text-2xl md:text-3xl font-bold aurora-text mb-2 text-center">
          Overview
        </h2>
        <GradientBarChart data={days} />
      </section>
    </div>
  );
};

export default Dashboard;
