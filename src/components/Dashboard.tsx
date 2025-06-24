import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer
} from "recharts";
import type { Task } from "./types";
import GradientBarChart from "./GradientBarChart";
import { useTasks } from "@/hooks/useTasks";

// Define aurora palette color stops - swapped colors for pending/completed
const auroraPieColors = [
  "#fd8a4a",     // aurora orange (Completed - now orange)
  "#22c55e",     // green (Pending - now green)
];

const auroraBarColor = "#da4af7"; // aurora violet for bars

const Dashboard: React.FC = () => {
  const { tasks, loading, error } = useTasks();

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-fade-in">
        <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm p-6">
          <h2 className="text-2xl md:text-3xl font-bold aurora-text mb-4 text-center">
            Dashboard
          </h2>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col gap-8 animate-fade-in">
        <div className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm p-6">
          <h2 className="text-2xl md:text-3xl font-bold aurora-text mb-4 text-center">
            Dashboard
          </h2>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pie data
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pending = tasks.length - completed;

  const pieData = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  // Bar data (tasks completed per day, last 7 days) - Fixed calculation
  const today = new Date();
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i)); // Last 7 days including today
    // Format as dd-mm
    const label = `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    // Count tasks completed on this specific day
    const completedOnDay = tasks.filter((t) => {
      if (t.status !== "Completed") return false;
      // Use completedAt if present, else fallback to dueDate
      const dateStr = t.completedAt || t.dueDate;
      const taskDate = new Date(dateStr);
      return taskDate.toDateString() === d.toDateString();
    }).length;
    return { date: label, completed: completedOnDay };
  });

  // Get the 3 tasks with the latest due dates (descending)
  const latestTasks = [...tasks]
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Bar Chart Section - Full Width at Top */}
      <section className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm p-6">
        <h2 className="text-2xl md:text-3xl font-bold aurora-text mb-6 text-center">
          Overview
        </h2>
        <GradientBarChart data={days} height={280} />
      </section>

      {/* Bottom Section - Pie Chart and Latest Tasks Side by Side */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Pie Chart Section */}
        <section className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm p-6">
          <h2 className="text-2xl md:text-3xl font-bold aurora-text mb-4 text-center">
            Task Status
          </h2>
          {/* Enhanced Aurora Glow Wrapper for PieChart */}
          <div className="relative flex items-center justify-center w-full" style={{ minHeight: 340 }}>
            {/* Enhanced glow effects */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 opacity-20 blur-3xl animate-pulse"></div>
              <div className="absolute w-60 h-60 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-30 blur-2xl"></div>
            </div>
            <div className="relative z-10 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height={340}>
                <PieChart>
                  <defs>
                    {/* Swapped gradient definitions */}
                    <linearGradient id="aurora-pie-completed" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fd8a4a" />
                      <stop offset="100%" stopColor="#da4af7" />
                    </linearGradient>
                    <linearGradient id="aurora-pie-pending" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#BC13FE" />
                    </linearGradient>
                    {/* Enhanced glow filter */}
                    <filter id="pieGlow" height="300%" width="300%" x="-100%" y="-100%">
                      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
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
                    filter="url(#pieGlow)"
                  >
                    <Cell key="Completed" fill="url(#aurora-pie-completed)" />
                    <Cell key="Pending" fill="url(#aurora-pie-pending)" />
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Latest Task Status Section */}
        <section className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm p-6">
          <h2 className="text-2xl md:text-3xl font-bold aurora-text mb-6 text-center">
            Latest Tasks
          </h2>
          <div className="flex flex-col gap-4 justify-center h-full">
            {latestTasks.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                No tasks yet. Create your first task to get started!
              </div>
            ) : (
              latestTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col justify-between bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-lg px-4 py-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100 mb-3">{task.title}</span>
                  <span
                    className={
                      "inline-block px-3 py-1 rounded-full text-xs font-bold text-center " +
                      (task.status === "Completed"
                        ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : task.status === "Almost Done"
                          ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                          : task.status === "Pending"
                            ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                            : "bg-gray-100 dark:bg-gray-700/20 text-gray-700 dark:text-gray-300")
                    }
                  >
                    {task.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
