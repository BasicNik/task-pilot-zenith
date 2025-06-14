
import React, { useState } from "react";

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
  }, [status, priority, tag]);

  return (
    <div className="flex gap-4 flex-wrap items-center mb-2">
      <div>
        <label className="text-sm mr-1">Status:</label>
        <select
          className="border rounded px-2 py-1"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <div>
        <label className="text-sm mr-1">Priority:</label>
        <select
          className="border rounded px-2 py-1"
          value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          <option value="">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div>
        <label className="text-sm mr-1">Tag:</label>
        <select
          className="border rounded px-2 py-1"
          value={tag}
          onChange={e => setTag(e.target.value)}
        >
          <option value="">All</option>
          {tagSet.map((t) => (
            <option value={t} key={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
