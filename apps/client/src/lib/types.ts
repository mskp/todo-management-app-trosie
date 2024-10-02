export type StandardResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type Project = {
  id: number;
  title: string;
  createdDate: string;
  totalTodos: number;
  completedTodos: number;

  disableClick?: boolean;
};

export type Todo = {
  id: number;
  description: string;
  status: boolean;
  disableClick?: boolean;
};

export type ProjectWithTodos = Project & { todos: Todo[] };
