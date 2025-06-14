
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  tags: string[];
  status: "Pending" | "Completed";
};

interface Props {
  onChange: (v: { status?: string; priority?: string; tags?: string[]; date?: string }) => void;
  todoList: Task[];
}

const TaskFilters: React.FC<Props> = ({ onChange, todoList }) => {
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [tag, setTag] = useState<string>("");

  // Unique tag list for filter dropdown
  const tagSet = Array.from(new Set(todoList.flatMap(t => t.tags)));

  React.useEffect(() => {
    const filter: { status?: string; priority?: string; tags?: string[] } = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (tag) filter.tags = [tag];
    onChange(filter);
  }, [status, priority, tag, onChange]);

  return (
    <div className="flex gap-4 flex-wrap items-center mb-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="status-filter">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="status-filter" className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="priority-filter">Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger id="priority-filter" className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <Label htmlFor="tag-filter">Tag</Label>
        <Select value={tag} onValueChange={setTag}>
          <SelectTrigger id="tag-filter" className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {tagSet.map((t) => (
              <SelectItem value={t} key={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TaskFilters;
