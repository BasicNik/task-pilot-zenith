
import React, { useState } from "react";
import { Edit, Trash2, Check, Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Task } from "./types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TaskTableProps {
  tasks: Task[];
  selected: string[];
  onRowCheckbox: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMarkComplete: (id: string) => void;
  onStar: (id: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  selected,
  onRowCheckbox,
  onSelectAll,
  onEdit,
  onDelete,
  onMarkComplete,
  onStar,
}) => {
  const [detailsTask, setDetailsTask] = useState<Task | null>(null);
  const allChecked = tasks.length > 0 && selected.length === tasks.length;

  return (
    <div className="bg-card dark:bg-zinc-800/90 rounded-lg border max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted">
      <table className="w-full text-sm md:text-base table-fixed">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            <th className="px-2 md:px-3 py-2 w-10 text-left">
              <Checkbox
                checked={allChecked}
                onCheckedChange={onSelectAll}
                aria-label="Select all tasks"
              />
            </th>
            <th className="px-2 md:px-3 py-2 w-12 text-left">Star</th>
            <th className="px-2 md:px-4 py-2 w-32 text-left">Title</th>
            <th className="px-2 py-2 w-40 text-left">Description</th>
            <th className="px-2 py-2 w-20 text-left">Due</th>
            <th className="px-2 py-2 w-20 text-left">Priority</th>
            <th className="px-2 py-2 w-24 text-left">Tags</th>
            <th className="px-2 py-2 w-20 text-left">Status</th>
            <th className="px-2 py-2 w-24 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td className="text-center py-8 text-muted-foreground" colSpan={9}>
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr
                key={task.id}
                className="border-b relative hover:bg-muted/60 transition"
              >
                <td className="px-2 md:px-3">
                  <Checkbox
                    checked={selected.includes(task.id)}
                    onCheckedChange={(checked) => onRowCheckbox(task.id, !!checked)}
                    aria-label="Select task"
                  />
                </td>
                <td className="px-2 md:px-3">
                  <button
                    title={task.starred ? "Unstar" : "Star"}
                    onClick={() => onStar(task.id)}
                    className={`rounded p-0.5 ${task.starred ? "text-yellow-400" : "text-gray-400 hover:text-yellow-500"}`}
                    aria-label="Star Task"
                  >
                    <Star size={20} fill={task.starred ? "#facc15" : "none"} />
                  </button>
                </td>
                <td className="px-2 md:px-4 py-2 font-semibold">
                  <span 
                    onClick={() => setDetailsTask(task)}
                    className="story-link cursor-pointer truncate block"
                  >
                    {task.title}
                  </span>
                </td>
                <td className="px-2 py-2 truncate">{task.description}</td>
                <td className="px-2 py-2 text-xs">
                  {new Date(task.dueDate).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-2 py-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      task.priority === "High"
                        ? "bg-red-500/10 text-red-600"
                        : task.priority === "Medium"
                        ? "bg-yellow-400/10 text-yellow-600"
                        : "bg-green-500/10 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <div className="flex gap-1 flex-wrap">
                    {task.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted px-2 py-0.5 rounded text-xs truncate"
                      >
                        {tag}
                      </span>
                    ))}
                    {task.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{task.tags.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-2">
                  <span
                    className={`text-xs font-medium ${
                      task.status === "Completed"
                        ? "text-green-600"
                        : task.status === "Almost Done"
                        ? "text-yellow-600"
                        : task.status === "Pending"
                        ? "text-blue-600"
                        : "text-foreground"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-2 py-2">
                  <div className="flex gap-1">
                    <button
                      title="Edit"
                      onClick={() => onEdit(task)}
                      className="p-1 rounded hover:bg-primary/20 transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      title="Delete"
                      className="p-1 rounded hover:bg-destructive/20 transition"
                      onClick={() => onDelete(task.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                    {task.status === "Pending" && (
                      <button
                        title="Mark as Complete"
                        className="p-1 rounded hover:bg-green-200/60 transition"
                        onClick={() => onMarkComplete(task.id)}
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Dialog open={!!detailsTask} onOpenChange={open => !open && setDetailsTask(null)}>
        <DialogContent className="glass-task-details max-w-lg p-6">
          {detailsTask && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold mb-2">{detailsTask.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <div><span className="font-semibold">Description:</span> {detailsTask.description || 'No description'}</div>
                <div><span className="font-semibold">Due Date:</span> {new Date(detailsTask.dueDate).toLocaleString()}</div>
                <div><span className="font-semibold">Priority:</span> {detailsTask.priority}</div>
                <div><span className="font-semibold">Tags:</span> {detailsTask.tags.join(', ') || 'None'}</div>
                <div><span className="font-semibold">Status:</span> {detailsTask.status}</div>
                {detailsTask.completedAt && <div><span className="font-semibold">Completed At:</span> {new Date(detailsTask.completedAt).toLocaleString()}</div>}
                <div><span className="font-semibold">Starred:</span> {detailsTask.starred ? 'Yes' : 'No'}</div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskTable;
