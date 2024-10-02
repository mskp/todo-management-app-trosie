import { isAxiosError } from 'axios';

export const handleError = (error: unknown): string => {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return 'An unexpected error occurred';
};
