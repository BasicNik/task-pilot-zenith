import React, { useState } from "react";
import TaskDialog from "./TaskDialog";
import TaskFilters from "./TaskFilters";
import TaskTable from "./TaskTable";
import BulkActions from "./BulkActions";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import type { Task, TaskStatus } from "./types";

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Finish TaskPilot UI",
    description: "Design and implement main workspace",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    priority: "High",
    tags: ["frontend", "design"],
    status: "Pending",
    starred: false,
  },
  {
    id: 2,
    title: "Write requirements doc",
    description: "Describe features and APIs",
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    priority: "Medium",
    tags: ["planning"],
    status: "Completed",
    starred: false,
  },
];

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<{ status?: string; priority?: string; tags?: string[], date?: string }>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [selected, setSelected] = useState<number[]>([]);

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
  const handleAdd = (data: Omit<Task, "id">) => {
    setTasks((prev) => [
      {
        ...data,
        id: Date.now(),
        starred: false,
      },
      ...prev,
    ]);
    setDialogOpen(false);
    toast({ title: "Task Added!", description: data.title });
  };

  const handleEdit = (data: Omit<Task, "id">, id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    setDialogOpen(false);
    toast({ title: "Task Updated!", description: data.title });
  };

  const handleDelete = (id: number) => {
    const t = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast({ title: "Task Deleted", description: t?.title });
    setSelected((prev) => prev.filter(sid => sid !== id));
  };

  const handleBulkDelete = () => {
    setTasks((prev) => prev.filter((t) => !selected.includes(t.id)));
    toast({ title: "Tasks Deleted", description: `${selected.length} tasks removed.` });
    setSelected([]);
  };

  const handleBulkComplete = () => {
    setTasks((prev) =>
      prev.map((t) =>
        selected.includes(t.id) ? { ...t, status: "Completed" } : t
      )
    );
    toast({ title: "Tasks Completed!", description: `${selected.length} tasks marked as complete.` });
    setSelected([]);
  };

  const handleBulkStar = () => {
    setTasks((prev) => prev.map((t) => selected.includes(t.id) ? { ...t, starred: true } : t));
    toast({ title: "Starred!", description: `${selected.length} tasks starred.` });
    setSelected([]);
  };

  const handleBulkStatusChange = (status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        selected.includes(t.id) ? { ...t, status } : t
      )
    );
    toast({ title: "Status Updated", description: `Status set for ${selected.length} tasks` });
    setSelected([]);
  };

  const handleMarkComplete = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Completed" } : t)));
    const t = tasks.find((t) => t.id === id);
    toast({ title: "Task Completed!", description: t?.title });
    setSelected((prev) => prev.filter(sid => sid !== id));
  };

  // Bulk selection
  const allChecked = sorted.length > 0 && sorted.every((t) => selected.includes(t.id));
  const handleSelectAll = () => setSelected(allChecked ? [] : sorted.map(t => t.id));
  const handleRowCheckbox = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );

  // Star handler per task
  const handleStar = (id: number) => {
    setTasks((prev) => prev.map((task) => task.id === id ? { ...task, starred: !task.starred } : task));
    const t = tasks.find((t) => t.id === id);
    toast({
      title: !t?.starred ? "Task Starred" : "Task Unstarred",
      description: t?.title,
    });
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
          variant="aurora-outline"
          size="sm"
          className="aurora-glow w-full md:w-36"
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
