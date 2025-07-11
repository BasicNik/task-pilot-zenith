
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Task, TaskStatus } from "./types"; // Import both Task & TaskStatus

interface Props {
  onChange: (v: { status?: string; priority?: string; tags?: string[]; date?:string }) => void;
  todoList: Task[];
}

// For generating the status dropdown from the type definition
const STATUS_OPTIONS: TaskStatus[] = [
  "Not Started",
  "Pending",
  "Completed",
  "Almost Done",
];

const TaskFilters: React.FC<Props> = ({ onChange, todoList }) => {
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");
  const [tag, setTag] = useState<string>("all");

  // Unique tag list for filter dropdown
  const tagSet = Array.from(new Set(todoList.flatMap(t => t.tags).filter(Boolean)));

  React.useEffect(() => {
    const filter: { status?: string; priority?: string; tags?: string[] } = {};
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (tag && tag !== 'all') filter.tags = [tag];
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
            <SelectItem value="all">All</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem value={s} key={s}>{s}</SelectItem>
            ))}
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
            <SelectItem value="all">All</SelectItem>
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
            <SelectItem value="all">All</SelectItem>
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
