import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Todo, CreateTodoData, UpdateTodoData } from '../../types/todo';
import { statusOptions } from '../../utils/constents';

interface TodoDialogProps {
  todo?: Todo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTodoData | UpdateTodoData) => Promise<void>;
}

const TodoDialog: React.FC<TodoDialogProps> = ({
  todo,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<string>('todo');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const isEditing = !!todo;

  useEffect(() => {
    if (todo && isOpen) {
      setTitle(todo.title);
      setDescription(todo.description);
      setStatus(todo.status);
    } else if (!todo && isOpen) {
      setTitle('');
      setDescription('');
      setStatus('todo');
    }
    setErrors({});
  }, [todo, isOpen]);

  const validateForm = () => {
    const newErrors: { title?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const data = isEditing 
        ? { title: title.trim(), description: description.trim(), status }
        : { title: title.trim(), description: description.trim() };
      
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Failed to save todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {isEditing ? 'Edit Todo' : 'Create New Todo'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter todo title..."
              className={`mt-1 ${errors.title ? 'border-red-500' : ''}`}
              disabled={loading}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              className="mt-1 min-h-[80px]"
              disabled={loading}
            />
          </div>
          
          {isEditing && (
            <div>
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="mt-1" disabled={loading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.slice(1).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleSave} 
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClose} 
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TodoDialog;