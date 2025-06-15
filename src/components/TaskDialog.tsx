
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
  status: "Pending" | "Completed";
};

const PRIORITIES = ["Low", "Medium", "High"];

const TaskDialog: React.FC<Props> = ({ open, onOpenChange, onSave, editing }) => {
  const [fields, setFields] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "Medium",
    tags: [],
    status: "Pending",
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
        status: "Pending",
      });
      setTagsInput("");
    }
  }, [editing, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusToggle = () => {
    setFields((prev) => ({
      ...prev,
      status: prev.status === "Pending" ? "Completed" : "Pending",
    }));
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
              {/* --- Dropdown styling fix below --- 
                - The select now adapts to dark/light mode.
                - If you want to change its size or font, adjust Tailwind classes below.
                - BG color, border, focus ring, and text color will adapt automatically.
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
          <div className="flex gap-3 items-center">
            <Label>Status:</Label>
            <button
              type="button"
              onClick={handleStatusToggle}
              className={`rounded px-3 py-1 border ${fields.status === "Completed" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"}`}
            >
              {fields.status}
            </button>
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
              - To change the gradient or style, edit 'aurora-bg' and other classes below.
              - This matches the rest of the app's gradient button style.
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
