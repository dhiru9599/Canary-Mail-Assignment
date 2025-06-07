import React, { useState } from 'react';
import { Circle, Plus } from 'lucide-react';
import { Card, CardContent } from './components/ui/Card';
import { Button } from './components/ui/button';
import Header from './components/layout/Header';
import TodoFilters from './components/todo/TodoFilters';
import TodoStats from './components/todo/TodoStats';
import TodoCard from './components/todo/TodoCard';
import TodoDialog from './components/todo/TodoDialog';
import { useTodos } from './hooks/useTodos';
import type { Todo, TodoFilters as FilterType, CreateTodoData, UpdateTodoData } from './types/todo';

const App: React.FC = () => {
  const {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    updateTodoStatus,
    filterTodos,
  } = useTodos();

  const [filters, setFilters] = useState<FilterType>({
    search: '',
    status: 'all',
  });
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();

  // Filter todos based on current filters
  const filteredTodos = filterTodos(filters);

  // Dialog handlers
  const openCreateDialog = () => {
    setEditingTodo(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (todo: Todo) => {
    setEditingTodo(todo);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTodo(undefined);
  };

  // CRUD handlers
  const handleCreate = async (data: CreateTodoData) => {
    await createTodo(data);
  };

  const handleUpdate = async (data: UpdateTodoData) => {
    if (!editingTodo) return;
    await updateTodo(editingTodo.id, data);
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
  };

  const handleStatusChange = async (id: number, status: string) => {
    await updateTodoStatus(id, status);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading todos...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="border-0 bg-white/70 backdrop-blur-sm max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <Circle className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-4">
              Make sure your backend server is running on http://localhost:8000
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header />
        
        <TodoFilters
          filters={filters}
          onFiltersChange={setFilters}
          onCreateClick={openCreateDialog}
        />
        
        <TodoStats todos={filteredTodos} />
        
        {/* Todo Grid */}
        {filteredTodos.length === 0 ? (
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Circle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No todos found</h3>
              <p className="text-gray-500 mb-4">
                {filters.search || filters.status !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first todo to get started'
                }
              </p>
              {!filters.search && filters.status === 'all' && (
                <Button
                  onClick={openCreateDialog}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Todo
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onEdit={openEditDialog}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {/* Dialog */}
        <TodoDialog
          todo={editingTodo}
          isOpen={isDialogOpen}
          onClose={closeDialog}
          onSave={editingTodo ? handleUpdate : handleCreate}
        />
      </div>
    </div>
  );
};

export default App;