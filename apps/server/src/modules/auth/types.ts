import { StandardResponse } from 'src/common/utils/standard-response';

export type AuthResponse = Promise<
  StandardResponse<{
    accessToken: string;
  }>
>;
