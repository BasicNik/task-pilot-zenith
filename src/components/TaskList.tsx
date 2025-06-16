import React, { useState } from "react";
import TaskDialog from "./TaskDialog";
import TaskFilters from "./TaskFilters";
import TaskTable from "./TaskTable";
import BulkActions from "./BulkActions";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import type { Task, TaskStatus } from "./types";

const TaskList: React.FC = () => {
  const { tasks, loading, error, addTask, updateTask, deleteTask, bulkDeleteTasks, bulkUpdateTasks } = useTasks();
  const [filter, setFilter] = useState<{ status?: string; priority?: string; tags?: string[], date?: string }>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-0">Your Tasks</h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Loading your tasks...
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-0">Your Tasks</h2>
            <p className="text-muted-foreground mb-2 text-sm">
              Error loading tasks
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Filtering
  const filtered = tasks.filter((task) => {
    if (filter.status && task.status !== filter.status) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    if (filter.tags && filter.tags.length > 0 && !filter.tags.every(tag => task.tags.includes(tag))) return false;
    // No date filtering for now
    return true;
  });

  // Starred at the top
  const sorted = [...filtered].sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0));

  // CRUD Handlers
  const handleAdd = async (data: Omit<Task, "id">) => {
    const result = await addTask(data);
    if (result) {
      setDialogOpen(false);
      toast({ title: "Task Added!", description: data.title });
    } else {
      toast({ 
        title: "Error", 
        description: "Failed to add task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = async (data: Omit<Task, "id">, id: string) => {
    const success = await updateTask(id, data);
    if (success) {
      setDialogOpen(false);
      toast({ title: "Task Updated!", description: data.title });
    } else {
      toast({ 
        title: "Error", 
        description: "Failed to update task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    const t = tasks.find((t) => t.id === id);
    const success = await deleteTask(id);
    if (success) {
      toast({ title: "Task Deleted", description: t?.title });
      setSelected((prev) => prev.filter(sid => sid !== id));
    } else {
      toast({ 
        title: "Error", 
        description: "Failed to delete task. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBulkDelete = async () => {
    const success = await bulkDeleteTasks(selected);
    if (success) {
      toast({ title: "Tasks Deleted", description: `${selected.length} tasks removed.` });
      setSelected([]);
    } else {
      toast({ 
        title: "Error", 
        description: "Failed to delete tasks. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBulkComplete = async () => {
    const success = await bulkUpdateTasks(selected, { status: "Completed" });
    if (success) {
      toast({ title: "Tasks Completed!", description: `${selected.length} tasks marked as complete.` });
      setSelected([]);
    } else {
      toast({ 
        title: "Error", 
        description: "Failed to update tasks. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBulkStar = async () => {
    const success = await bulkUpdateTasks(selected, { starred: true });
    if (success) {
      toast({ title: "Starred!", description: `${selected.length} tasks starred.` });
      setSelected([]);
    } else {
      toast({ 
        title: "Error", 
        description: "Failed to star tasks. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBulkStatusChange = async (status: TaskStatus) => {
    const success = await bulkUpdateTasks(selected, { status });
    if (success) {
      toast({ title: "Status Updated", description: `Status set for ${selected.length} tasks` });
      setSelected([]);
    } else {
      toast({ 
        title: "Error", 
        description: "Failed to update task status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMarkComplete = async (id: string) => {
    const success = await updateTask(id, { status: "Completed" });
    if (success) {
      const t = tasks.find((t) => t.id === id);
      toast({ title: "Task Completed!", description: t?.title });
      setSelected((prev) => prev.filter(sid => sid !== id));
    } else {
      toast({ 
        title: "Error", 
        description: "Failed to complete task. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Bulk selection
  const allChecked = sorted.length > 0 && sorted.every((t) => selected.includes(t.id));
  const handleSelectAll = () => setSelected(allChecked ? [] : sorted.map(t => t.id));
  const handleRowCheckbox = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );

  // Star handler per task
  const handleStar = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    const newStarredValue = !task?.starred;
    const success = await updateTask(id, { starred: newStarredValue });
    if (success) {
      toast({
        title: newStarredValue ? "Task Starred" : "Task Unstarred",
        description: task?.title,
      });
    } else {
      toast({ 
        title: "Error", 
        description: "Failed to update task. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* Header and New Task Button */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-0">Your Tasks</h2>
          <p className="text-muted-foreground mb-2 text-sm">
            Organize, filter, and manage your to-dos efficiently.
          </p>
        </div>
        <Button
          onClick={() => { setDialogOpen(true); setEditing(null); }}
          className="aurora-outline-btn aurora-glow w-full md:w-56 bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-border shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          size="sm"
        >
          + New Task
        </Button>
      </div>
      {/* Filters become vertical on mobile */}
      <div className="w-full">
        <TaskFilters onChange={setFilter} todoList={tasks} />
      </div>
      {/* Bulk Actions - extracted to separate component */}
      {selected.length > 0 && (
        <BulkActions
          selectedCount={selected.length}
          onDelete={handleBulkDelete}
          onComplete={handleBulkComplete}
          onStar={handleBulkStar}
          onStatusChange={handleBulkStatusChange}
        />
      )}
      {/* Table */}
      <div className="w-full overflow-x-auto">
        <TaskTable
          tasks={sorted}
          selected={selected}
          onRowCheckbox={handleRowCheckbox}
          onSelectAll={handleSelectAll}
          allChecked={allChecked}
          onEdit={(task) => { setEditing(task); setDialogOpen(true); }}
          onDelete={handleDelete}
          onMarkComplete={handleMarkComplete}
          onStar={handleStar}
        />
      </div>
      {/* Dialogs */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={editing ? (data) => handleEdit(data, editing.id) : handleAdd}
        editing={editing}
      />
    </div>
  );
};

export default TaskList;
