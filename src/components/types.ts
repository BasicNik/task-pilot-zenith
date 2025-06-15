
export type TaskStatus = "Not Started" | "Pending" | "Completed" | "Almost Done";

export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  tags: string[];
  status: TaskStatus;
};
