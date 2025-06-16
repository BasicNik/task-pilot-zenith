export type TaskStatus = "Not Started" | "Pending" | "Completed" | "Almost Done";

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  tags: string[];
  status: TaskStatus;
  starred?: boolean; // Added for starring tasks
};
