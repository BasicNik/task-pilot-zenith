import React, { useState } from "react";
import { Edit, Trash2, Check } from "lucide-react";
import TaskDialog from "./TaskDialog";
import TaskFilters from "./TaskFilters";
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
  },
  {
    id: 2,
    title: "Write requirements doc",
    description: "Describe features and APIs",
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    priority: "Medium",
    tags: ["planning"],
    status: "Completed",
  },
];

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<{ status?: string; priority?: string; tags?: string[], date?: string }>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  // Filtering
  const filtered = tasks.filter((task) => {
    if (filter.status && task.status !== filter.status) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    if (filter.tags && filter.tags.length > 0 && !filter.tags.every(tag => task.tags.includes(tag))) return false;
    // No date filtering for now
    return true;
  });

  // CRUD Handlers
  const handleAdd = (data: Omit<Task, "id">) => {
    setTasks((prev) => [
      {
        ...data,
        id: Date.now(),
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
  };

  const handleMarkComplete = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Completed" } : t)));
    const t = tasks.find((t) => t.id === id);
    toast({ title: "Task Completed!", description: t?.title });
  };

  return (
    <div className="flex flex-col gap-6">
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
          className="aurora-glow w-36"
        >
          + New Task
        </Button>
      </div>
      <TaskFilters onChange={setFilter} todoList={tasks} />
      <div className="overflow-x-auto bg-card dark:bg-zinc-900 rounded-lg border max-h-[60vh]">
        <table className="min-w-full">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="px-4 py-2">Title</th>
              <th>Description</th>
              <th>Due</th>
              <th>Priority</th>
              <th>Tags</th>
              <th>Status</th>
              <th className="w-[110px]"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className="text-center py-8 text-muted-foreground" colSpan={7}>No tasks found.</td>
              </tr>
            ) : (
              filtered.map((task) => (
                <tr key={task.id} className="border-b">
                  <td className="px-4 py-2 font-semibold">{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    {new Date(task.dueDate).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </td>
                  <td>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${task.priority === "High"
                      ? "bg-red-500/10 text-red-600"
                      : task.priority === "Medium"
                        ? "bg-yellow-400/10 text-yellow-600"
                        : "bg-green-500/10 text-green-700"
                      }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      {task.tags.map((tag) => (
                        <span key={tag} className="bg-muted px-2 py-0.5 rounded text-xs">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={
                      task.status === "Completed" ? "font-medium text-green-600" :
                        task.status === "Almost Done" ? "font-medium text-yellow-600" :
                          task.status === "Pending" ? "font-medium text-blue-600" :
                            "font-medium text-white dark:text-white"
                    }>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        title="Edit"
                        onClick={() => {
                          setEditing(task);
                          setDialogOpen(true);
                        }}
                        className="p-1 rounded hover:bg-primary/20 transition"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        title="Delete"
                        className="p-1 rounded hover:bg-destructive/20 transition"
                        onClick={() => handleDelete(task.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                      {task.status === "Pending" && (
                        <button
                          title="Mark as Complete"
                          className="p-1 rounded hover:bg-green-200/60 transition"
                          onClick={() => handleMarkComplete(task.id)}
                        >
                          <Check size={20} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
