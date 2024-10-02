import axios from '@/lib/axios';
import { Project, StandardResponse } from '@/lib/types';
import Projects from './_components/Projects';

async function getProjectsList() {
  const response =
    await axios.get<StandardResponse<{ projects: Project[] }>>('/project');
  return response.data!.data?.projects!;
}

export default async function ProjectsPage() {
  let projects: Project[] = [];
  let error = null;

  try {
    projects = await getProjectsList();
  } catch (e) {
    error = 'Failed to fetch projects';
  }

  return (
    <div className="mx-auto p-4">
      <Projects initialProjects={projects} error={error} />
    </div>
  );
}
