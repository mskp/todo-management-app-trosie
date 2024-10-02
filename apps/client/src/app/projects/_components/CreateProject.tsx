'use client';

import { createProject } from '@/actions/project-and-todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Project } from '@/lib/types';
import { useRef, useTransition } from 'react';

/**
 * Handles the creation of new projects. It allows users to input a project title,
 * optimistically adds the project to the list, and then submits the form data
 * to the server. The form is reset upon successful creation.
 */
export default function CreateProject({
  addOptimisticProject,
}: {
  addOptimisticProject: (project: Project) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const action = async (formData: FormData) => {
    const title = formData.get('title') as string;

    const optimisticProject: Project = {
      id: Math.random(),
      title: title.trim(),
      createdDate: new Date().toISOString(),
      completedTodos: 0,
      totalTodos: 0,
      disableClick: true,
    };
    addOptimisticProject(optimisticProject);

    startTransition(async () => {
      try {
        await createProject(title);
        formRef.current?.reset();
      } catch (error) {
        console.error('Failed to create project:', error);
      }
    });
  };

  return (
    <form
      ref={formRef}
      action={action}
      className="mb-8 w-full max-w-md mx-auto"
    >
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <Input
          type="text"
          placeholder="Enter project title"
          className="w-full"
          name="title"
          maxLength={40}
          disabled={isPending}
          required
        />
        <Button
          type="submit"
          variant="outline"
          className="w-full sm:w-auto"
          disabled={isPending}
        >
          Create
        </Button>
      </div>
    </form>
  );
}
