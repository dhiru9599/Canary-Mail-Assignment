import { useState, useEffect, useCallback } from 'react';
import type { Todo, CreateTodoData, UpdateTodoData, TodoFilters } from '../types/todo';
import { todoApi } from '../services/api';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos from API
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.getTodos();
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new todo
  const createTodo = useCallback(async (todoData: CreateTodoData) => {
    try {
      setError(null);
      const newTodo = await todoApi.createTodo(todoData);
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
      throw err;
    }
  }, []);

  // Update an existing todo
  const updateTodo = useCallback(async (id: number, updates: UpdateTodoData) => {
    try {
      setError(null);
      const updatedTodo = await todoApi.updateTodo(id, updates);
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      throw err;
    }
  }, []);

  // Delete a todo
  const deleteTodo = useCallback(async (id: number) => {
    try {
      setError(null);
      await todoApi.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      throw err;
    }
  }, []);

  // Update todo status
  const updateTodoStatus = useCallback(async (id: number, status: string) => {
    return updateTodo(id, { status: status as any });
  }, [updateTodo]);

  // Filter todos
  const filterTodos = useCallback((filters: TodoFilters) => {
    return todos.filter(todo => {
      const matchesSearch = 
        todo.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        todo.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || todo.status === filters.status;
      
      return matchesSearch && matchesStatus;
    });
  }, [todos]);

  // Get todos grouped by status
  const getGroupedTodos = useCallback((filteredTodos: Todo[]) => {
    return {
      todo: filteredTodos.filter(t => t.status === 'todo'),
      inprogress: filteredTodos.filter(t => t.status === 'inprogress'),
      pending: filteredTodos.filter(t => t.status === 'pending'),
      completed: filteredTodos.filter(t => t.status === 'completed'),
    };
  }, []);

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return {
    todos,
    loading,
    error,
    loadTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    updateTodoStatus,
    filterTodos,
    getGroupedTodos,
  };
};