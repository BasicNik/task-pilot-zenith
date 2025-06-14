
import React from "react";
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  tags: string[];
  status: "Pending" | "Completed";
};

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
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    const completedOnDay = tasks.filter(
      (t) =>
        t.status === "Completed" &&
        new Date(t.dueDate).toDateString() === d.toDateString()
    ).length;
    return { day: label, Completed: completedOnDay };
  });

  return (
    <div className="flex flex-col md:flex-row gap-12 animate-fade-in">
      <section className="flex-1">
        <h2 className="text-2xl font-bold mb-2">Task Status</h2>
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={64}
              outerRadius={100}
              fill="#8884d8"
              label
              >
              <Cell key="Completed" fill="#22c55e" />
              <Cell key="Pending" fill="#facc15" />
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </section>
      <section className="flex-1">
        <h2 className="text-2xl font-bold mb-2">Completion Trend (Last 5 Days)</h2>
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={days}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="Completed" fill="#6366f1" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default Dashboard;
