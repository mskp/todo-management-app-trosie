import { downloadGistAsMarkdown } from '@/actions/project-and-todo';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Dispatch, SetStateAction } from 'react';

type GistExportSuccessDialogProps = {
  gistUrl: string | null;
  setGistUrl: Dispatch<SetStateAction<string | null>>;
};

/**
 * A dialog component that displays a message when a project is successfully exported as a Gist.
 * It provides options to view the Gist or download it as a Markdown file.
 */
export default function GistExportSuccessDialog({
  gistUrl,
  setGistUrl,
}: GistExportSuccessDialogProps) {
  const handleDownload = async () => {
    if (gistUrl) {
      const response = await downloadGistAsMarkdown(gistUrl);
      if (response.success && response.data) {
        const blob = new Blob([response.data.fileContent], {
          type: 'text/markdown',
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = response.data.filename || 'gist.md';
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download gist:', response.error);
      }
    }
  };

  return (
    <Dialog open={!!gistUrl} onOpenChange={() => setGistUrl(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gist Exported Successfully</DialogTitle>
          <DialogDescription>
            Your project has been exported as a Gist. You can view it or
            download it as markdown.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Input value={gistUrl ?? ''} readOnly />
        </div>
        <DialogFooter className="sm:justify-end">
          <Button
            onClick={() => window.open(gistUrl || '', '_blank')}
            variant="outline"
          >
            View Gist
          </Button>
          <Button onClick={handleDownload}>Download as Markdown</Button>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
