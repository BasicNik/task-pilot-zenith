
import React, { useState } from "react";
import { Edit, Trash2, Check, Star } from "lucide-react";
import TaskDialog from "./TaskDialog";
import TaskFilters from "./TaskFilters";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-3 bg-muted/70 px-4 py-2 rounded-lg border mb-2 items-center">
          <span className="font-semibold">{selected.length} selected</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="px-4"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
          <Button
            variant="aurora-outline"
            size="sm"
            onClick={handleBulkComplete}
            className="px-4"
          >
            <Check className="w-4 h-4" /> Mark Complete
          </Button>
          <Button
            variant="aurora-outline"
            size="sm"
            onClick={handleBulkStar}
            className="px-4"
          >
            <Star className="w-4 h-4" /> Star
          </Button>
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <select
              className="border rounded px-2 py-1 bg-background"
              onChange={(e) => handleBulkStatusChange(e.target.value as TaskStatus)}
              defaultValue=""
            >
              <option value="" disabled>Change all...</option>
              <option value="Not Started">Not Started</option>
              <option value="Pending">Pending</option>
              <option value="Almost Done">Almost Done</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-card dark:bg-zinc-800/90 rounded-lg border max-h-[60vh]">
        <table className="min-w-full">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="px-3">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all tasks"
                />
              </th>
              <th className="px-3">Star</th>
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
            {sorted.length === 0 ? (
              <tr>
                <td className="text-center py-8 text-muted-foreground" colSpan={9}>No tasks found.</td>
              </tr>
            ) : (
              sorted.map((task) => (
                <tr key={task.id} className="border-b relative">
                  {/* Checkbox */}
                  <td className="px-3">
                    <Checkbox
                      checked={selected.includes(task.id)}
                      onCheckedChange={() => handleRowCheckbox(task.id)}
                      aria-label="Select task"
                    />
                  </td>
                  {/* Star button */}
                  <td className="px-3 text-center">
                    <button
                      title={task.starred ? "Unstar" : "Star"}
                      onClick={() => handleStar(task.id)}
                      className={`rounded p-0.5 ${task.starred ? "text-yellow-400" : "text-gray-400 hover:text-yellow-500"}`}
                      aria-label="Star Task"
                    >
                      <Star size={20} fill={task.starred ? "#facc15" : "none"} />
                    </button>
                  </td>
                  {/* Title */}
                  <td className="px-4 py-2 font-semibold">{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    {new Date(task.dueDate).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </td>
                  <td>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      task.priority === "High"
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
