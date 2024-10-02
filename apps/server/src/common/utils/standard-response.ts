export type StandardResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export function standardResponse<T>({
  success = true,
  message = undefined,
  data = undefined,
}: {
  success?: boolean;
  message?: string;
  data?: T;
}): StandardResponse<T> {
  return {
    success,
    message,
    data,
  };
}
