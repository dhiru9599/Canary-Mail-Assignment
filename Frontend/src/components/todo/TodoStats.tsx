import React from 'react';
import { Card, CardContent } from '../ui/Card';
import type { Todo } from '../../types/todo';
import { statusConfig } from '../../utils/constents';

interface TodoStatsProps {
  todos: Todo[];
}

const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  const groupedTodos = {
    todo: todos.filter(t => t.status === 'todo'),
    inprogress: todos.filter(t => t.status === 'inprogress'),
    pending: todos.filter(t => t.status === 'pending'),
    completed: todos.filter(t => t.status === 'completed'),
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {Object.entries(groupedTodos).map(([status, todoList]) => {
        const config = statusConfig[status as keyof typeof statusConfig];
        const StatusIcon = config.icon;
        
        return (
          <Card key={status} className="border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 rounded-full ${config.color} flex items-center justify-center mx-auto mb-2`}>
                <StatusIcon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{todoList.length}</div>
              <div className="text-sm text-gray-600">{config.label}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TodoStats;