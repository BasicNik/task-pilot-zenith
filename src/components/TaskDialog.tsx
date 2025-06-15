
import React, { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (data: Omit<Task, "id">) => void;
  editing: Task | null;
}

type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  tags: string[];
  status: "Not Started" | "Pending" | "Completed" | "Almost Done";
};

const PRIORITIES = ["Low", "Medium", "High"];
const STATUS_OPTIONS = [
  "Not Started",
  "Pending",
  "Completed",
  "Almost Done"
] as const;

const TaskDialog: React.FC<Props> = ({ open, onOpenChange, onSave, editing }) => {
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
    if (editing) {
      setFields({ ...editing, dueDate: editing.dueDate.split("T")[0] });
      setTagsInput(editing.tags.join(", "));
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
  }, [editing, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...fields, tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <h3 className="font-bold text-xl">
            {editing ? "Edit Task" : "Add New Task"}
          </h3>
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
              {/* Dropdown for priority: 
                  To change the size of this select, update Tailwind classes in className below
                  (e.g. px-3 py-2 for padding, text-base for font size)
              */}
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
            {/* Dropdown for status:
                To change the size of this select, update Tailwind classes in className below
                (e.g. px-3 py-2 for padding, text-base for font size)
            */}
            <select
              id="status"
              name="status"
              value={fields.status}
              onChange={handleChange}
              className="border border-input rounded-md px-3 py-2 w-full bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
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
            {/* ---- Add Task button now uses aurora gradient ----
                To change gradient or size, edit aurora-bg + px-4/py-2 below
                This matches the rest of the app's gradient button style.
            */}
            <button
              type="submit"
              className="aurora-bg rounded px-4 py-2 font-medium transition-all hover:scale-105"
            >
              {editing ? "Save Changes" : "Add Task"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
