'use client';

import {
  createTodo,
  deleteTodo,
  exportProjectAsGist,
  toggleCompleteTodo,
  updateProjectTitle,
  updateTodo,
} from '@/actions/project-and-todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type Todo } from '@/lib/types';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
  Fragment,
  useOptimistic,
  useRef,
  useState,
  useTransition,
} from 'react';
import GistExportSuccessDialog from './GistExportSuccessDialog';
import TodoItem from './TodoItem';

type TodoListProps = {
  projectId: number;
  initialTodos: Todo[];
  project: { id: number; title: string };
};

/**
 * TodoList component renders a list of todos for a specific project.
 */
export default function TodoList({
  projectId,
  initialTodos,
  project,
}: TodoListProps) {
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(initialTodos);
  const [optimisticProject, setOptimisticProject] = useOptimistic(project);
  const formRef = useRef<HTMLFormElement>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(project.title);
  const [isPending, startTransition] = useTransition();
  const [gistLoading, setGistLoading] = useState<boolean>(false);

  const [gistUrl, setGistUrl] = useState<string | null>(null);

  const handleExportAsGist = async () => {
    setGistLoading(true);
    const response = await exportProjectAsGist(project.id);
    if (response.success) {
      setGistUrl(response.data!.gistUrl as string);
    }
    setGistLoading(false);
  };

  async function handleCreateTodo(formData: FormData) {
    const description = formData.get('description') as string;
    const newTodo: Todo = {
      id: Math.random(),
      description,
      status: false,

      disableClick: true,
    };

    setOptimisticTodos((prev) => [newTodo, ...prev]);

    startTransition(async () => {
      try {
        await createTodo(projectId, description);
        formRef.current?.reset();
      } catch (error) {
        console.error('Failed to update project title:', error);
        setOptimisticTodos(() => [...initialTodos]);
        setOptimisticProject((rest) => ({ ...rest, title: project.title }));
      }
    });
  }

  const handleStatusChange = async (todoId: number, newStatus: boolean) => {
    setOptimisticTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId ? { ...todo, status: newStatus } : todo,
      ),
    );
    await toggleCompleteTodo(todoId, newStatus);
  };

  const handleDelete = async (todoId: number) => {
    setOptimisticTodos((prev) => prev.filter((todo) => todo.id !== todoId));
    await deleteTodo(todoId);
  };

  const handleEdit = async (todoId: number, newDescription: string) => {
    setOptimisticTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId ? { ...todo, description: newDescription } : todo,
      ),
    );
    await updateTodo(todoId, { description: newDescription });
  };

  const handleTitleUpdate = async () => {
    if (editedTitle.trim() && editedTitle !== optimisticProject.title) {
      setOptimisticProject((prev) => ({ ...prev, title: editedTitle }));
      setIsEditingTitle(false);

      startTransition(async () => {
        try {
          await updateProjectTitle(optimisticProject.id, editedTitle);
        } catch (error) {
          console.error('Failed to update project title:', error);
          setOptimisticProject((prev) => ({ ...prev, title: project.title }));
          setEditedTitle(project.title);
        }
      });
    }
  };

  return (
    <Fragment>
      <div className="mb-8 w-full max-w-4xl mx-auto">
        <nav className="flex mb-4 text-sm" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                href="/projects"
                className="inline-flex items-center text-gray-700 hover:text-blue-600"
              >
                Projects
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span
                  className="ml-1 text-gray-500 md:ml-2"
                  style={{ wordBreak: 'break-word' }}
                >
                  {optimisticProject.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        {isEditingTitle ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Input
              type="text"
              value={editedTitle}
              maxLength={40}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="flex-grow w-full sm:w-auto mb-2 sm:mb-0"
              required
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleTitleUpdate}
                variant="outline"
                className="flex-1 sm:flex-initial"
              >
                Save
              </Button>
              <Button
                onClick={() => setIsEditingTitle(false)}
                variant="outline"
                className="flex-1 sm:flex-initial"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ wordBreak: 'break-word' }}
          >
            <h2 className="text-2xl font-bold mb-2 sm:mb-0">
              {optimisticProject.title}
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setIsEditingTitle(true)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Edit Title
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleExportAsGist}
                disabled={gistLoading}
              >
                Export as Gist
              </Button>
            </div>
          </div>
        )}
      </div>
      <form
        ref={formRef}
        action={handleCreateTodo}
        className="mb-8 w-full max-w-md mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            name="description"
            maxLength={100}
            placeholder="Enter todo description"
            className="w-full"
            disabled={isPending}
            required
          />
          <Button
            disabled={isPending}
            type="submit"
            variant="outline"
            className="w-full sm:w-auto"
          >
            Add todo
          </Button>
        </div>
      </form>
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Todos</h2>
        <ul className="space-y-4">
          {optimisticTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </ul>
        {optimisticTodos.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No todos yet. Add some to get started!
          </p>
        )}
      </div>

      <GistExportSuccessDialog gistUrl={gistUrl} setGistUrl={setGistUrl} />
    </Fragment>
  );
}
