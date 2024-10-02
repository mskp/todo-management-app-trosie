import axios from '@/lib/axios';
import { ProjectWithTodos, StandardResponse } from '@/lib/types';
import { notFound } from 'next/navigation';
import Todo from './_components/TodoList';

async function getProjectWithTodos(projectId: number) {
  try {
    const response = await axios.get<
      StandardResponse<{ project: ProjectWithTodos }>
    >(`/project/${projectId}`);
    return response.data!.data?.project!;
  } catch (error) {
    return null;
  }
}

export default async function TodoPage({
  params,
}: {
  params: { projectId: string };
}) {
  const projectId = parseInt(params.projectId);

  const project = await getProjectWithTodos(projectId);

  if (!project) notFound();

  return (
    <div className="mx-auto p-4">
      <Todo
        projectId={projectId}
        initialTodos={project.todos}
        project={project}
      />
    </div>
  );
}
