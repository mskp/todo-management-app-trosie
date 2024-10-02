'use client';

import { Project } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/**
 * Renders a grid of projects. It displays
 * either an error message or a list of projects. Each project links
 * to its detail page and shows basic project info such as title,
 * creation date, and progress.
 */
export default function ProjectsGrid({
  projects,
  error,
}: {
  projects: Project[];
  error: string | null;
}) {
  if (error) {
    return <ProjectsErrorMessage message={error} />;
  }

  if (projects.length === 0) {
    return (
      <ProjectsErrorMessage message="No projects yet. Create your first project above!" />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className={cn('block', {
            'pointer-events-none animate-pulse': project?.disableClick,
          })}
        >
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ wordBreak: 'break-word' }}
            >
              {project.title}
            </h3>
            <p className="text-sm text-gray-600">
              Created: {new Date(project.createdDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Progress: {project.completedTodos} / {project.totalTodos}{' '}
              completed
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

/**
 * Renders an error message.
 */
function ProjectsErrorMessage({ message }: { message: string }) {
  return <p className="text-gray-500">{message}</p>;
}
