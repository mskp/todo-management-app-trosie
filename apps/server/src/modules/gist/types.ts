import { StandardResponse } from 'src/common/utils/standard-response';

export type GistResponse = {
  html_url: string;
};

export type ExportProjectAsGistResponse = Promise<
  StandardResponse<{
    gistUrl: string;
  }>
>;
