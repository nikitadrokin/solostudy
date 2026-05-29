'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { FocusRoomTagCatalog } from '@/components/admin/focus-room-tag-catalog';
import { FocusRoomTagCombobox } from '@/components/admin/focus-room-tag-combobox';
import { extractVideoId } from '@/components/focus-room/youtube-player';
import { Lightbox } from '@/components/lightbox';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { YOUTUBE_VALIDATION_PATTERNS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { api, apiClient } from '@/utils/trpc';

function isValidYouTubeInput(value: string): boolean {
  return YOUTUBE_VALIDATION_PATTERNS.some((pattern) => pattern.test(value));
}

/** Admin table for `focus_room_video`: list, add, edit, remove rows (tRPC). */
export default function FocusRoomVideosAdmin() {
  const queryClient = useQueryClient();
  const { data: videos = [], isLoading } = useQuery(
    api.focus.listVideosAdmin.queryOptions()
  );
  const { data: tagOptions = [] } = useQuery(
    api.focus.listFocusTags.queryOptions()
  );

  const [addUrl, setAddUrl] = useState('');
  const [edits, setEdits] = useState<
    Record<string, { title: string; tag: string }>
  >({});
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const invalidateLists = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: api.focus.listVideosAdmin.queryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: api.focus.listVideos.queryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: api.focus.listFocusTags.queryKey(),
    });
  }, [queryClient]);

  const { mutate: addVideo, isPending: isAdding } = useMutation({
    mutationFn: (videoId: string) =>
      apiClient.focus.addVideo.mutate({ videoId }),
    onSuccess: () => {
      invalidateLists();
      setAddUrl('');
    },
  });

  const {
    mutate: updateVideo,
    isPending: isUpdating,
    variables: updateVariables,
  } = useMutation({
    mutationFn: (input: { id: string; title?: string; tag?: string }) =>
      apiClient.focus.updateVideo.mutate(input),
    onSuccess: () => {
      invalidateLists();
    },
  });

  const { mutate: deleteVideo, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => apiClient.focus.deleteVideo.mutate({ id }),
    onSuccess: () => {
      invalidateLists();
      setPendingDeleteId(null);
    },
  });

  const currentInputVideoId = useMemo(() => {
    const trimmed = addUrl.trim();
    if (!(trimmed && isValidYouTubeInput(trimmed))) {
      return null;
    }
    return extractVideoId(trimmed) || trimmed;
  }, [addUrl]);

  const handleAdd = useCallback(() => {
    if (currentInputVideoId) {
      addVideo(currentInputVideoId);
    }
  }, [addVideo, currentInputVideoId]);

  const handleSaveRow = useCallback(
    (id: string, baselineTitle: string, baselineTag: string) => {
      const draft = edits[id];
      const title = draft?.title ?? baselineTitle;
      const tag = draft?.tag ?? baselineTag;
      const payload: {
        id: string;
        title?: string;
        tag?: string;
      } = { id };
      if (title !== baselineTitle) {
        payload.title = title;
      }
      if (tag !== baselineTag) {
        payload.tag = tag;
      }
      if (!(payload.title !== undefined || payload.tag !== undefined)) {
        return;
      }
      updateVideo(payload);
      setEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [edits, updateVideo]
  );

  const deleteTargetTitle = useMemo(() => {
    if (!pendingDeleteId) {
      return '';
    }
    return videos.find((v) => v.id === pendingDeleteId)?.title ?? '';
  }, [pendingDeleteId, videos]);
  const lightboxImages = useMemo(
    () =>
      videos.map((video) => ({
        alt: `YouTube thumbnail for ${video.title}`,
        caption: video.title,
        src: video.thumbnailUrl,
      })),
    [videos]
  );

  return (
    <div className="space-y-6">
      <FocusRoomTagCatalog />

      <div className="space-y-3 rounded-xl border p-4">
        <div>
          <h2 className="font-semibold text-base">Add video</h2>
          <p className="text-muted-foreground text-sm">
            Paste a YouTube URL or video ID to add it to the catalog.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Label htmlFor="admin-add-focus-video">YouTube URL</Label>
            <Input
              className={cn(
                'max-w-xl',
                addUrl.trim() && !isValidYouTubeInput(addUrl.trim())
                  ? 'border-destructive'
                  : ''
              )}
              id="admin-add-focus-video"
              onChange={(e) => setAddUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              placeholder="https://www.youtube.com/watch?v=…"
              type="url"
              value={addUrl}
            />
          </div>
          {currentInputVideoId ? (
            <img
              alt="Preview thumbnail"
              className="h-[52px] w-[92px] rounded-md border object-cover"
              src={`https://img.youtube.com/vi/${currentInputVideoId}/mqdefault.jpg`}
            />
          ) : null}
          <Button
            disabled={!currentInputVideoId}
            isLoading={isAdding}
            onClick={handleAdd}
            type="button"
          >
            Add video
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[160px]">Tag</TableHead>
              <TableHead className="w-[90px] whitespace-nowrap">Added</TableHead>
              <TableHead className="w-[90px] whitespace-nowrap">Updated</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell className="text-muted-foreground" colSpan={6}>
                  Loading…
                </TableCell>
              </TableRow>
            ) : null}
            {!isLoading && videos.length === 0 ? (
              <TableRow>
                <TableCell className="text-muted-foreground" colSpan={6}>
                  No focus room videos yet.
                </TableCell>
              </TableRow>
            ) : null}
            {isLoading
              ? null
              : videos.map((video, index) => {
                  const draft = edits[video.id];
                  const title = draft?.title ?? video.title;
                  const tag = draft?.tag ?? video.tag;
                  const baselineTitle = video.title;
                  const baselineTag = video.tag;
                  const dirty = title !== baselineTitle || tag !== baselineTag;
                  return (
                    <TableRow key={video.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <Lightbox
                            className="h-[68px] w-[120px] gap-0"
                            images={lightboxImages}
                            thumbnailIndex={index}
                            thumbnailClassName="relative h-full w-full rounded-md bg-muted"
                            thumbnailImgClassName="h-full w-full object-cover"
                          />
                          <p
                            className="max-w-[120px] truncate font-mono text-muted-foreground text-[10px]"
                            title={video.id}
                          >
                            {video.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          aria-label={`Title for ${video.id}`}
                          onChange={(e) =>
                            setEdits((prev) => ({
                              ...prev,
                              [video.id]: {
                                title: e.target.value,
                                tag,
                              },
                            }))
                          }
                          value={title}
                        />
                      </TableCell>
                      <TableCell>
                        <FocusRoomTagCombobox
                          aria-label={`Tag for video ${video.id}`}
                          id={`admin-video-tag-${video.id}`}
                          onValueChange={(slug) =>
                            setEdits((prev) => ({
                              ...prev,
                              [video.id]: { title, tag: slug },
                            }))
                          }
                          tags={tagOptions}
                          value={tag}
                        />
                      </TableCell>
                      <TableCell
                        className="text-muted-foreground text-xs"
                        title={video.createdAt.toLocaleString()}
                      >
                        {video.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        className="text-muted-foreground text-xs"
                        title={video.updatedAt.toLocaleString()}
                      >
                        {video.updatedAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            disabled={!dirty || isUpdating}
                            isLoading={
                              isUpdating && updateVariables?.id === video.id
                            }
                            onClick={() =>
                              handleSaveRow(
                                video.id,
                                baselineTitle,
                                baselineTag
                              )
                            }
                            size="sm"
                            type="button"
                            variant="secondary"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => setPendingDeleteId(video.id)}
                            size="sm"
                            type="button"
                            variant="destructive"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteId(null);
          }
        }}
        open={pendingDeleteId !== null}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove video</AlertDialogTitle>
            <AlertDialogDescription>
              Remove “{deleteTargetTitle}” from the focus room catalog? This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => setPendingDeleteId(null)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={!pendingDeleteId}
              isLoading={isDeleting}
              onClick={() => {
                if (pendingDeleteId) {
                  deleteVideo(pendingDeleteId);
                }
              }}
              type="button"
              variant="destructive"
            >
              Remove
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
