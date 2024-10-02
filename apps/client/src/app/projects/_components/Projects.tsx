'use client';

import { Project } from '@/lib/types';
import { useOptimistic } from 'react';
import CreateProject from './CreateProject';
import ProjectsGrid from './ProjectsGrid';

type ProjectsProps = {
  initialProjects: Project[];
  error: string | null;
};

/**
 * This component handles the display and management of projects.
 * It uses optimistic updates to temporarily add new projects to the list
 * before receiving confirmation from the server. It also handles error
 * states and renders a grid of projects.
 */
export default function Projects({ initialProjects, error }: ProjectsProps) {
  const [optimisticProjects, setOptimisticProject] =
    useOptimistic<Project[]>(initialProjects);

  const addOptimisticProject = (project: Project) => {
    setOptimisticProject((prev) => [project, ...prev]);
  };

  return (
    <div>
      <div className="mb-8">
        <CreateProject addOptimisticProject={addOptimisticProject} />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <ProjectsGrid projects={optimisticProjects} error={error} />
      </div>
    </div>
  );
}
