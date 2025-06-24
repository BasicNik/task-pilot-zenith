import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card";
import { useTasks } from "../hooks/useTasks";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { tasks, loading } = useTasks();
  const [activeIndex, setActiveIndex] = useState(0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === "Completed").length,
    pending: tasks.filter(task => task.status === "Pending").length,
    notStarted: tasks.filter(task => task.status === "Not Started").length,
    almostDone: tasks.filter(task => task.status === "Almost Done").length,
  };

  const completionRate = taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0;

  // Priority distribution
  const priorityStats = {
    high: tasks.filter(task => task.priority === "High").length,
    medium: tasks.filter(task => task.priority === "Medium").length,
    low: tasks.filter(task => task.priority === "Low").length,
  };

  // Weekly overview data (mock data for demonstration)
  const weeklyData = [
    { day: 'Mon', completed: tasks.filter(t => t.status === 'Completed').length * 0.1 },
    { day: 'Tue', completed: tasks.filter(t => t.status === 'Completed').length * 0.15 },
    { day: 'Wed', completed: tasks.filter(t => t.status === 'Completed').length * 0.2 },
    { day: 'Thu', completed: tasks.filter(t => t.status === 'Completed').length * 0.12 },
    { day: 'Fri', completed: tasks.filter(t => t.status === 'Completed').length * 0.18 },
    { day: 'Sat', completed: tasks.filter(t => t.status === 'Completed').length * 0.08 },
    { day: 'Sun', completed: tasks.filter(t => t.status === 'Completed').length * 0.27 },
  ];

  // Status distribution for pie chart (colors from screenshot)
  const statusData = [
    { name: 'Completed', value: taskStats.completed, color: '#22d3a5' }, // green
    { name: 'Pending', value: taskStats.pending, color: '#ffb86b' }, // orange
    { name: 'Not Started', value: taskStats.notStarted, color: '#6272a4' }, // blue-ish
    { name: 'Almost Done', value: taskStats.almostDone, color: '#bd93f9' }, // purple
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Overview of your task management
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#10162f] border border-blue-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-400">Total Tasks</CardTitle>
            <div className="h-4 w-4 text-blue-400">📋</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-300">{taskStats.total}</div>
            <p className="text-xs text-blue-400">All your tasks</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0d1b16] border border-green-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-400">Completed</CardTitle>
            <div className="h-4 w-4 text-green-400">✅</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-300">{taskStats.completed}</div>
            <p className="text-xs text-green-400">{completionRate}% completion rate</p>
          </CardContent>
        </Card>

        <Card className="bg-[#23160f] border border-orange-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-400">Pending</CardTitle>
            <div className="h-4 w-4 text-orange-400">⏳</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-300">{taskStats.pending}</div>
            <p className="text-xs text-orange-400">In progress</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a1430] border border-purple-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-400">High Priority</CardTitle>
            <div className="h-4 w-4 text-purple-400">🔥</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-300">{priorityStats.high}</div>
            <p className="text-xs text-purple-400">Urgent tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Weekly Overview */}
        <Card className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/50 dark:to-gray-900/50 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-800 dark:text-slate-200">Weekly Overview</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Tasks completed this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }} 
                  />
                  <Bar 
                    dataKey="completed" 
                    fill="url(#blueGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Task Status Distribution - Donut chart with details */}
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/50 dark:to-blue-900/50 border-indigo-200 dark:border-indigo-700">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full h-full p-4 gap-4">
            {/* Donut Chart */}
            <div className="flex-1 flex items-center justify-center min-w-[320px]">
              <PieChart width={340} height={340}>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={130}
                  strokeWidth={5}
                  activeIndex={activeIndex}
                  activeShape={({ outerRadius = 0, ...props }) => (
                    <Sector {...props} outerRadius={outerRadius + 10} />
                  )}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(0)}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
            {/* Details/Legend */}
            <div className="flex-1 flex flex-col justify-center gap-4 min-w-[220px]">
              <div className="text-lg font-semibold mb-2 text-indigo-800 dark:text-indigo-200">Task Status Details</div>
              {statusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-3 text-base">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="font-medium" style={{ color: entry.color }}>{entry.name}</span>
                  <span className="ml-auto font-bold text-white/80 dark:text-white/90">{entry.value}</span>
                </div>
              ))}
              <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 leading-none font-medium">
                  Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none">
                  Showing current task status distribution
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
