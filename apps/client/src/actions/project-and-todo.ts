'use server';

import axios from '@/lib/axios';
import { StandardResponse } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { handleError } from './utils';

// Define common types
type ActionResponse<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

function getGistId(url: string) {
  const regex = /https:\/\/gist\.github\.com\/\w+\/([a-fA-F0-9]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function createProject(
  title: string,
): Promise<ActionResponse<{ id: number }>> {
  try {
    const response = await axios.post<StandardResponse<{ id: number }>>(
      '/project',
      { title },
    );
    revalidatePath('/projects');
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, error: handleError(error) };
  }
}

export async function updateProjectTitle(
  id: number,
  title: string,
): Promise<ActionResponse> {
  try {
    await axios.patch(`/project/${id}`, { title });
    revalidatePath(`/projects/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: handleError(error) };
  }
}

export async function exportProjectAsGist(
  projectId: number,
): Promise<ActionResponse<{ gistUrl: string }>> {
  try {
    const response = await axios.post<StandardResponse<{ gistUrl: string }>>(
      `/gist/export/${projectId}`,
    );
    const gistUrl = response.data?.data?.gistUrl!;
    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: { gistUrl } };
  } catch (error) {
    return { success: false, error: handleError(error) };
  }
}

export async function createTodo(
  projectId: number,
  description: string,
): Promise<ActionResponse<{ id: number }>> {
  try {
    const response = await axios.post<StandardResponse<{ id: number }>>(
      `/todo/${projectId}`,
      { description },
    );
    revalidatePath(`/projects/${projectId}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, error: handleError(error) };
  }
}

export async function updateTodo(
  id: number,
  data: { description?: string },
): Promise<ActionResponse> {
  try {
    await axios.patch(`/todo/${id}/update`, data);
    revalidatePath(`/projects/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: handleError(error) };
  }
}

export async function toggleCompleteTodo(
  id: number,
  status: boolean,
): Promise<ActionResponse> {
  try {
    await axios.patch(`/todo/${id}/complete`, { status });
    revalidatePath(`/projects/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: handleError(error) };
  }
}

export async function deleteTodo(todoId: number): Promise<ActionResponse> {
  try {
    await axios.delete(`/todo/${todoId}`);
    revalidatePath(`/projects/${todoId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: handleError(error) };
  }
}

export async function downloadGistAsMarkdown(
  gistUrl: string,
): Promise<ActionResponse<{ filename: string; fileContent: Blob }>> {
  const gistId = getGistId(gistUrl);

  if (!gistId) {
    return { success: false, error: 'Invalid gist URL' };
  }

  try {
    const response = await axios.get<
      ActionResponse<{ filename: string; fileContent: Blob }>
    >(`/gist/download/${gistId}`);

    const data = response.data.data;

    return {
      success: true,
      data: {
        filename: data?.filename!,
        fileContent: data?.fileContent!,
      },
    };
  } catch (error) {
    return { success: false, error: handleError(error) };
  }
}
