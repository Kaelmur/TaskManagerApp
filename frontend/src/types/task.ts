export type Priority = "Low" | "Medium" | "High";
export type Status = "In Progress" | "Completed" | "Pending";

export interface TodoItem {
  text: string;
  completed: boolean;
}

export type AttachmentFile = {
  url: string;
};

export interface User {
  profileImageUrl: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string | null;
  assignedTo: User[];
  todoChecklist: TodoItem[];
  attachments: AttachmentFile[];
}
