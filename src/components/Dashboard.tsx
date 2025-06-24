
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useTasks } from "../hooks/useTasks";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { tasks, loading } = useTasks();

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

  // Status distribution for pie chart
  const statusData = [
    { name: 'Completed', value: taskStats.completed, color: '#10b981' },
    { name: 'Pending', value: taskStats.pending, color: '#f59e0b' },
    { name: 'Not Started', value: taskStats.notStarted, color: '#ef4444' },
    { name: 'Almost Done', value: taskStats.almostDone, color: '#3b82f6' },
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
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Tasks</CardTitle>
            <div className="h-4 w-4 text-blue-600 dark:text-blue-400">📋</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{taskStats.total}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">All your tasks</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Completed</CardTitle>
            <div className="h-4 w-4 text-green-600 dark:text-green-400">✅</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">{taskStats.completed}</div>
            <p className="text-xs text-green-600 dark:text-green-400">{completionRate}% completion rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Pending</CardTitle>
            <div className="h-4 w-4 text-orange-600 dark:text-orange-400">⏳</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">{taskStats.pending}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">In progress</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">High Priority</CardTitle>
            <div className="h-4 w-4 text-purple-600 dark:text-purple-400">🔥</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">{priorityStats.high}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400">Urgent tasks</p>
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

        {/* Task Status Distribution */}
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-900/50 dark:to-blue-900/50 border-indigo-200 dark:border-indigo-700">
          <CardHeader>
            <CardTitle className="text-indigo-800 dark:text-indigo-200">Task Status</CardTitle>
            <CardDescription className="text-indigo-600 dark:text-indigo-400">Distribution of task statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    className="drop-shadow-lg"
                    style={{
                      filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.3))'
                    }}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {statusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-1 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
