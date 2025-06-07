import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { TodoFilters as FilterType } from '../../types/todo';
import { statusOptions } from '../../utils/constents';

interface TodoFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  onCreateClick: () => void;
}

const TodoFilters: React.FC<TodoFiltersProps> = ({
  filters,
  onFiltersChange,
  onCreateClick,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({ ...filters, status });
  };

  return (
    <Card className="mb-8 border-0 bg-white/70 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search todos..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filters.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={onCreateClick}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Todo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoFilters;