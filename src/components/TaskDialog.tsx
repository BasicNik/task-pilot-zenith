
import React, { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Task } from "./types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (data: Omit<Task, "id">) => void;
  task: Task | undefined;
}

const PRIORITIES = ["Low", "Medium", "High"];
const STATUS_OPTIONS = [
  "Not Started",
  "Pending",
  "Completed",
  "Almost Done"
] as const;

// Color mapping for status select
const statusColorMap: Record<string, string> = {
  "Not Started": "bg-white text-black border-2 border-gray-300 dark:bg-neutral-900 dark:text-white dark:border-gray-600",
  "Pending": "bg-blue-500 text-white",
  "Completed": "bg-green-500 text-white",
  "Almost Done": "bg-yellow-400 text-yellow-900",
};

const TaskDialog: React.FC<Props> = ({ open, onOpenChange, onSave, task }) => {
  const [fields, setFields] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "Medium",
    tags: [],
    status: "Not Started",
  });
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (task) {
      setFields({ ...task, dueDate: task.dueDate.split("T")[0] });
      setTagsInput(task.tags.join(", "));
    } else {
      setFields({
        title: "",
        description: "",
        dueDate: new Date().toISOString().split("T")[0],
        priority: "Medium",
        tags: [],
        status: "Not Started",
      });
      setTagsInput("");
    }
  }, [task, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...fields, tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean) });
  };

  // Compute select box color classes based on status
  const statusSelectClasses =
    "rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:outline-none transition-colors " +
    (statusColorMap[fields.status] || "border border-input");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {task ? "Edit Task" : "Add New Task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required value={fields.title} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" value={fields.description} onChange={handleChange} />
          </div>
          <div className="flex gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={fields.dueDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                name="priority"
                value={fields.priority}
                onChange={handleChange}
                className="border border-input rounded-md px-3 py-2 w-full bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="work, home"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            {/* This select will show in the correct color depending on choice */}
            <select
              id="status"
              name="status"
              value={fields.status}
              onChange={handleChange}
              className={statusSelectClasses}
            >
              {STATUS_OPTIONS.map((statusOpt) => (
                <option key={statusOpt} value={statusOpt}>
                  {statusOpt}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="bg-muted text-gray-700 dark:text-gray-300 rounded px-4 py-2 mr-2"
            >
              Cancel
            </button>
            {/* Gradient button for adding or saving a task */}
            <button
              type="submit"
              className="aurora-bg rounded px-4 py-2 font-medium transition-all hover:scale-105"
            >
              {task ? "Save Changes" : "Add Task"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
