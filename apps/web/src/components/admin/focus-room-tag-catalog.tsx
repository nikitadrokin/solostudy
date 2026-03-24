'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
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
import { api, apiClient } from '@/utils/trpc';

/** Admin UI to create, rename, and remove unused entries in `focus_room_tag`. */
export function FocusRoomTagCatalog() {
  const queryClient = useQueryClient();
  const { data: tags = [] } = useQuery(api.focus.listFocusTags.queryOptions());

  const [newLabel, setNewLabel] = useState('');
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [pendingDeleteSlug, setPendingDeleteSlug] = useState<string | null>(
    null
  );

  const invalidateTags = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: api.focus.listFocusTags.queryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: api.focus.listVideos.queryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: api.focus.listVideosAdmin.queryKey(),
    });
  }, [queryClient]);

  const { mutate: createTag, isPending: isCreating } = useMutation({
    mutationFn: (label: string) =>
      apiClient.focus.createFocusTag.mutate({ label }),
    onSuccess: () => {
      invalidateTags();
      setNewLabel('');
    },
  });

  const {
    mutate: updateTag,
    isPending: isUpdating,
    variables: updateTagVariables,
  } = useMutation({
    mutationFn: (input: { slug: string; label: string }) =>
      apiClient.focus.updateFocusTag.mutate(input),
    onSuccess: (_, vars) => {
      invalidateTags();
      setEdits((prev) => {
        const next = { ...prev };
        delete next[vars.slug];
        return next;
      });
    },
  });

  const { mutate: deleteTag, isPending: isDeleting } = useMutation({
    mutationFn: (slug: string) =>
      apiClient.focus.deleteFocusTag.mutate({ slug }),
    onSuccess: () => {
      invalidateTags();
      setPendingDeleteSlug(null);
    },
  });

  const handleCreate = useCallback(() => {
    const trimmed = newLabel.trim();
    if (trimmed) {
      createTag(trimmed);
    }
  }, [createTag, newLabel]);

  const deleteTargetLabel = useMemo(() => {
    if (!pendingDeleteSlug) {
      return '';
    }
    return tags.find((t) => t.slug === pendingDeleteSlug)?.label ?? '';
  }, [pendingDeleteSlug, tags]);

  return (
    <div className="space-y-4 rounded-xl border p-4">
      <div>
        <h2 className="font-semibold text-lg">Tags</h2>
        <p className="text-muted-foreground text-sm">
          Labels shown in the focus room filters; slugs stay stable for URLs and
          data. Remove only applies when no video uses the tag.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[12rem] flex-1 space-y-2">
          <Label htmlFor="new-focus-tag-label">New tag</Label>
          <Input
            id="new-focus-tag-label"
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCreate();
              }
            }}
            placeholder="e.g. Rainy day"
            value={newLabel}
          />
        </div>
        <Button
          disabled={!newLabel.trim()}
          isLoading={isCreating}
          onClick={handleCreate}
          type="button"
        >
          Add tag
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Slug</TableHead>
              <TableHead>Label</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.length === 0 ? (
              <TableRow>
                <TableCell className="text-muted-foreground" colSpan={3}>
                  No tags yet.
                </TableCell>
              </TableRow>
            ) : null}
            {tags.map((tag) => {
              const draft = edits[tag.slug];
              const label = draft ?? tag.label;
              const dirty = label !== tag.label;
              return (
                <TableRow key={tag.slug}>
                  <TableCell className="font-mono text-xs">
                    {tag.slug}
                  </TableCell>
                  <TableCell>
                    <Input
                      aria-label={`Label for tag ${tag.slug}`}
                      onChange={(e) =>
                        setEdits((prev) => ({
                          ...prev,
                          [tag.slug]: e.target.value,
                        }))
                      }
                      value={label}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        disabled={!dirty || isUpdating}
                        isLoading={
                          isUpdating && updateTagVariables?.slug === tag.slug
                        }
                        onClick={() =>
                          updateTag({ slug: tag.slug, label: label.trim() })
                        }
                        size="sm"
                        type="button"
                        variant="secondary"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => setPendingDeleteSlug(tag.slug)}
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
            setPendingDeleteSlug(null);
          }
        }}
        open={pendingDeleteSlug !== null}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove tag</AlertDialogTitle>
            <AlertDialogDescription>
              Remove “{deleteTargetLabel}” ({pendingDeleteSlug})? Only allowed
              if no videos use this tag.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => setPendingDeleteSlug(null)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={!pendingDeleteSlug}
              isLoading={isDeleting}
              onClick={() => {
                if (pendingDeleteSlug) {
                  deleteTag(pendingDeleteSlug);
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
