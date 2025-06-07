import type { Todo, CreateTodoData, UpdateTodoData } from '../types/todo';
import { API_BASE_URL } from '../utils/constents';
class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(
      `API Error: ${response.status} ${response.statusText}`,
      response.status
    );
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

export const todoApi = {
  // Get all todos
  getTodos: async (): Promise<Todo[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      throw error;
    }
  },

  // Create a new todo
  createTodo: async (todo: CreateTodoData): Promise<Todo> => {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to create todo:', error);
      throw error;
    }
  },

  // Update a todo
  updateTodo: async (id: number, updates: UpdateTodoData): Promise<Todo> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to update todo:', error);
      throw error;
    }
  },

  // Delete a todo
  deleteTodo: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/`, {
        method: 'DELETE',
      });
      await handleResponse(response);
    } catch (error) {
      console.error('Failed to delete todo:', error);
      throw error;
    }
  },
};