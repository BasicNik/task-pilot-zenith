import React, { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "./ui/input";
import TaskDialog from "./TaskDialog";
import TaskFilters from "./TaskFilters";
import TaskTable from "./TaskTable";
import BulkActions from "./BulkActions";
import { useTasks } from "../hooks/useTasks";
import { Task, TaskStatus } from "./types";

const TaskList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "All">("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | "Low" | "Medium" | "High">("All");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const { tasks, loading, addTask, updateTask, deleteTask, bulkUpdateTasks, bulkDeleteTasks } = useTasks();

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await addTask(taskData);
      }
      setIsDialogOpen(false);
      setEditingTask(undefined);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSelectTask = (taskId: string, selected: boolean) => {
    setSelectedTasks(prev => 
      selected 
        ? [...prev, taskId]
        : prev.filter(id => id !== taskId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedTasks(selected ? filteredTasks.map(task => task.id) : []);
  };

  const handleBulkStatusUpdate = async (status: TaskStatus) => {
    try {
      await bulkUpdateTasks(selectedTasks, { status });
      setSelectedTasks([]);
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDeleteTasks(selectedTasks);
      setSelectedTasks([]);
    } catch (error) {
      console.error('Error deleting tasks:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your tasks and stay organized
          </p>
        </div>
        <Button 
          onClick={handleAddTask}
          className="w-full sm:w-auto relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-0 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-purple-500/25 dark:hover:shadow-purple-500/40 light:bg-white light:text-transparent light:bg-clip-text light:bg-gradient-to-r light:from-purple-500 light:via-pink-500 light:to-orange-500 light:border light:border-transparent light:[background:padding-box_white,border-box_linear-gradient(to_right,_#a855f7,_#ec4899,_#f97316)] light:hover:shadow-lg light:hover:shadow-purple-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="text-sm sm:text-base">New Task</span>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 lg:w-auto w-full">
          <TaskFilters
            todoList={tasks}
            onChange={({ status, priority, tags }) => {
              if (status) setStatusFilter(status as TaskStatus | "All");
              if (priority) setPriorityFilter(priority as "All" | "Low" | "Medium" | "High");
              // You can handle tags here if needed
            }}
          />
        </div>
      </div>

      {selectedTasks.length > 0 && (
        <BulkActions
          selectedCount={selectedTasks.length}
          onBulkStatusUpdate={handleBulkStatusUpdate}
          onBulkDelete={handleBulkDelete}
        />
      )}

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <TaskTable
            tasks={filteredTasks}
            selected={selectedTasks}
            onRowCheckbox={handleSelectTask}
            onSelectAll={handleSelectAll}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleComplete={async (taskId: string, completed: boolean) => {
              const task = tasks.find(t => t.id === taskId);
              if (task) {
                await updateTask(taskId, { 
                  status: completed ? "Completed" : "Not Started",
                  completedAt: completed ? new Date().toISOString() : undefined
                });
              }
            }}
          />
        </div>
      </div>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
};

export default TaskList;
