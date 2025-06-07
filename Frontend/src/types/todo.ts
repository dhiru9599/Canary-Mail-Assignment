export interface Todo {
    id: number;
    title: string;
    description: string;
    status: 'todo' | 'inprogress' | 'pending' | 'completed';
    status_display: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface CreateTodoData {
    title: string;
    description: string;
  }
  
  export interface UpdateTodoData {
    title?: string;
    description?: string;
    status?: 'todo' | 'inprogress' | 'pending' | 'completed';
    completed?: boolean;
  }
  
  export type TodoStatus = 'todo' | 'inprogress' | 'pending' | 'completed';
  
  export interface TodoFilters {
    search: string;
    status: string;
  }