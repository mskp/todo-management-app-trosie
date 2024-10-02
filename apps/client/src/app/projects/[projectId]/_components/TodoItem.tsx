import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Edit2, Trash2, X } from 'lucide-react';
import { Fragment, useState } from 'react';
import { Todo } from '@/lib/types';
import { cn } from '@/lib/utils';

type TodoItemProps = {
  todo: Todo;
  onStatusChange: (id: number, status: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, description: string) => void;
};

/**
 * A component representing a single todo item with options to edit, delete,
 * and change its completion status.
 */
export default function TodoItem({
  todo,
  onStatusChange,
  onDelete,
  onEdit,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(todo.description);

  const handleSaveEdit = () => {
    onEdit(todo.id, editedDescription);
    setIsEditing(false);
  };

  return (
    <li
      className={cn(
        'flex flex-row items-start sm:items-center justify-between p-4 bg-white shadow rounded transition-all hover:shadow-md',
        {
          'pointer-events-none animate-pulse': todo?.disableClick,
        },
      )}
    >
      <div className="flex items-center flex-grow mr-4 truncate">
        <div className="flex items-center w-full">
          <Checkbox
            id={`todo-${todo.id}`}
            checked={todo.status}
            onCheckedChange={(checked) =>
              onStatusChange(todo.id, checked as boolean)
            }
            className="mr-3"
          />
          {isEditing ? (
            <Input
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="flex-grow m-1"
            />
          ) : (
            <label
              htmlFor={`todo-${todo.id}`}
              className={`${
                todo.status ? 'line-through text-gray-500' : 'text-gray-900'
              } transition-all cursor-pointer break-words flex-grow flex-wrap text-wrap truncate m-2`}
            >
              {todo.description}
            </label>
          )}
        </div>
      </div>
      <div className="flex mt-2 sm:mt-0">
        {isEditing ? (
          <Fragment>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSaveEdit}
              className="text-green-500 hover:text-green-700 hover:bg-green-100 transition-colors mr-2"
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Save edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors mr-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel edit</span>
            </Button>
          </Fragment>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 transition-colors mr-2"
          >
            <Edit2 className="h-4 w-4" />
            <span className="sr-only">Edit todo</span>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete todo</span>
        </Button>
      </div>
    </li>
  );
}
