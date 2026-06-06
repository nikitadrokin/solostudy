/** biome-ignore-all lint/suspicious/noArrayIndexKey: Skeletons need unique keys */
'use client';

import { Dialog } from '@base-ui/react/dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Clock,
  LayoutDashboard,
  ListCheck,
  LogIn,
  Timer,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import SoloSessionPlanner from '@/components/focus-room/solo-session-planner';
import { extractVideoId } from '@/components/focus-room/youtube-player';
import TaskList from '@/components/task-list';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useFocusTimer } from '@/hooks/use-focus-timer';
import { useSession } from '@/lib/auth-client';
import { YOUTUBE_VALIDATION_PATTERNS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useFocusStore } from '@/stores/focus-store';
import { useVideoStore } from '@/stores/video-store';
import { api, apiClient } from '@/utils/trpc';

const ALL_TAGS = 'all' as const;

type OverlayControlsProps = {
  onPopoverOpenChange: (open: boolean) => void;
};

const OverlayControls: React.FC<OverlayControlsProps> = ({
  onPopoverOpenChange,
}) => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const { formattedTime, focusTime } = useFocusTimer();

  const { data: uncompletedTasks } = useQuery(
    api.todos.getUncompletedCount.queryOptions(undefined, {
      enabled: !!session,
    })
  );

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      onPopoverOpenChange(next);
    },
    [onPopoverOpenChange]
  );

  // H key toggles the HUD
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key !== 'h') return;
      const active = document.activeElement;
      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement
      )
        return;
      setOpen((prev) => {
        onPopoverOpenChange(!prev);
        return !prev;
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onPopoverOpenChange]);

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={open}>
      <Dialog.Trigger
        className="flex h-8 items-center gap-2 rounded-md border border-border/60 bg-background/80 px-3 font-medium text-xs backdrop-blur-sm hover:bg-background/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        title="Open Focus Studio (H)"
      >
        <LayoutDashboard className="size-3.5" />
        <span className="hidden sm:inline">Studio</span>
        {!!uncompletedTasks && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary font-bold text-[10px] text-primary-foreground">
            {uncompletedTasks > 9 ? '9+' : uncompletedTasks}
          </span>
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="absolute inset-0 z-40 bg-black/60 transition-all duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />

        <Dialog.Popup className="absolute inset-0 z-50 flex overflow-hidden p-6 transition-all duration-300 focus-visible:outline-none data-[ending-style]:opacity-0 data-[starting-style]:opacity-0">
          <div className="flex min-w-0 shrink-0 flex-col gap-4">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/50">
              <div className="flex shrink-0 items-center gap-2 border-white/10 border-b px-4 py-3">
                <ListCheck className="size-4 text-white/50" />
                <span className="font-semibold text-sm text-white/90">
                  Tasks
                </span>
                {!!uncompletedTasks && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-bold text-[10px] text-primary-foreground">
                    {uncompletedTasks > 9 ? '9+' : uncompletedTasks}
                  </span>
                )}
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-3 [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]">
                {session ? (
                  <TaskList />
                ) : (
                  <div className="flex flex-col items-center gap-4 py-10 text-center">
                    <ListCheck className="size-10 text-white/20" />
                    <p className="text-sm text-white/50">
                      Sign in to manage tasks
                    </p>
                    <Link
                      className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5')}
                      href="/login"
                    >
                      <LogIn className="size-3.5" />
                      Sign in
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-black/50 p-4">
              <SessionPanel
                focusTime={focusTime}
                formattedTime={formattedTime}
              />
            </div>
          </div>

          <div className="ml-4 flex w-72 flex-1 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/50">
            <VideosPanel />
          </div>

          <Dialog.Close className="absolute top-8 right-8 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50">
            <X className="size-4" />
            <span className="sr-only">Close Focus Studio</span>
          </Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

type SessionPanelProps = { formattedTime: string; focusTime: number };

const SessionPanel: React.FC<SessionPanelProps> = ({
  formattedTime,
  focusTime,
}) => {
  const { volume, isMuted } = useFocusStore();
  const { isVideoLoaded, handleVolumeChange, handleMuteToggle } =
    useVideoStore();
  const { data: session } = useSession();

  const { data: todayData } = useQuery(
    api.focus.getTodayFocusTime.queryOptions(undefined, {
      enabled: !!session,
      refetchInterval: 60_000,
    })
  );

  const totalTodaySeconds = (todayData?.totalSeconds ?? 0) + focusTime;
  const hours = Math.floor(totalTodaySeconds / 3600);
  const mins = Math.floor((totalTodaySeconds % 3600) / 60);
  const todayLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div className="space-y-4">
      <SoloSessionPlanner />

      {/* Volume */}
      <div className="space-y-2 border-white/10 border-t pt-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-white/60 text-xs">
            Video Volume
          </span>
          <span className="font-mono text-white/40 text-xs">
            {isMuted ? 'Muted' : `${volume}%`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="text-white/50 transition-colors hover:text-white"
            onClick={handleMuteToggle}
            type="button"
          >
            {isMuted ? (
              <VolumeX className="size-4" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </button>
          <input
            className="flex-1 accent-white opacity-80"
            disabled={!isVideoLoaded}
            max="100"
            min="0"
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            type="range"
            value={isMuted ? 0 : volume}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-[11px] text-white/40">
        <span className="flex items-center gap-1">
          <Timer className="size-3" />
          <span className="font-mono text-white/60">{formattedTime}</span>
          <span>session</span>
        </span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Clock className="size-3" />
          <span>{todayLabel} today</span>
        </span>
      </div>
    </div>
  );
};

const VideosPanel: React.FC = () => {
  const { handleVideoIdChange, handleLoadVideo } = useVideoStore();
  const { videoId } = useFocusStore();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const queryClient = useQueryClient();

  const { data: videos = [], isLoading } = useQuery(
    api.focus.listVideos.queryOptions()
  );
  const { data: focusTags = [] } = useQuery(
    api.focus.listFocusTags.queryOptions()
  );

  const [urlInput, setUrlInput] = useState(
    `https://www.youtube.com/watch?v=${videoId}`
  );
  const [activeTag, setActiveTag] = useState<string>(ALL_TAGS);

  const isValidUrl = useCallback(
    (url: string) => YOUTUBE_VALIDATION_PATTERNS.some((p) => p.test(url)),
    []
  );

  const currentInputId = useMemo(
    () =>
      urlInput && isValidUrl(urlInput)
        ? (extractVideoId(urlInput) ?? urlInput)
        : null,
    [urlInput, isValidUrl]
  );

  const existsInRoom = useMemo(
    () =>
      currentInputId ? videos.some((v) => v.id === currentInputId) : false,
    [currentInputId, videos]
  );

  const { mutate: addVideo, isPending: isAddingVideo } = useMutation({
    mutationFn: (id: string) =>
      apiClient.focus.addVideo.mutate({ videoId: id }),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: api.focus.listVideos.queryKey(),
      }),
  });

  useEffect(() => {
    if (videoId) setUrlInput(`https://www.youtube.com/watch?v=${videoId}`);
  }, [videoId]);

  useEffect(() => {
    if (
      activeTag !== ALL_TAGS &&
      !focusTags.some((t) => t.slug === activeTag)
    ) {
      setActiveTag(ALL_TAGS);
    }
  }, [activeTag, focusTags]);

  const filteredVideos = useMemo(
    () =>
      activeTag === ALL_TAGS
        ? videos
        : videos.filter((v) => v.tag === activeTag),
    [videos, activeTag]
  );

  const filterChips = useMemo(
    () => [
      { key: ALL_TAGS, label: 'All' },
      ...focusTags.map((t) => ({ key: t.slug, label: t.label })),
    ],
    [focusTags]
  );

  const handleVideoSelect = useCallback(
    (id: string) => {
      handleVideoIdChange(id);
      handleLoadVideo();
      setUrlInput(`https://www.youtube.com/watch?v=${id}`);
    },
    [handleVideoIdChange, handleLoadVideo]
  );

  const handleSubmit = useCallback(() => {
    const id = extractVideoId(urlInput) ?? urlInput;
    handleVideoIdChange(id);
    handleLoadVideo();
  }, [urlInput, handleVideoIdChange, handleLoadVideo]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Sticky header */}
      <div className="shrink-0 space-y-3 border-white/10 border-b px-5 pt-4 pb-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm text-white/90">
            Background Videos
          </span>
        </div>

        {/* Filter chips */}
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
          {filterChips.map((chip) => (
            <button
              className={cn(
                'shrink-0 rounded-full px-2.5 py-0.5 font-medium text-xs transition-colors',
                activeTag === chip.key
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
              )}
              key={chip.key}
              onClick={() => setActiveTag(chip.key)}
              type="button"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* URL input */}
        <div className="flex gap-2">
          <Input
            className={cn(
              'h-8 flex-1 border-white/20 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-white/30',
              urlInput && !isValidUrl(urlInput) ? 'border-destructive' : ''
            )}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder="Paste a YouTube URL"
            type="url"
            value={urlInput}
          />
          <button
            className="h-8 rounded-md border border-white/20 bg-white/10 px-3 font-medium text-white text-xs transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!(urlInput && isValidUrl(urlInput))}
            onClick={handleSubmit}
            type="button"
          >
            Load
          </button>
          {isAdmin && (
            <button
              className="h-8 rounded-md border border-white/10 bg-white/5 px-3 font-medium text-white/60 text-xs transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              disabled={
                !(urlInput && isValidUrl(urlInput)) ||
                existsInRoom ||
                isAddingVideo
              }
              onClick={() => {
                if (currentInputId && !existsInRoom) addVideo(currentInputId);
              }}
              type="button"
            >
              {isAddingVideo ? 'Adding…' : existsInRoom ? 'Added' : 'Add'}
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid flex-1 grid-cols-[repeat(auto-fill,minmax(180px,1fr))] content-start gap-4 overflow-y-auto p-5 [scrollbar-color:rgba(255,255,255,0.15)_transparent] [scrollbar-width:thin]">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div className="space-y-2" key={i}>
                <AspectRatio ratio={16 / 9}>
                  <Skeleton className="size-full rounded-xl opacity-20" />
                </AspectRatio>
                <Skeleton className="h-3 w-3/4 opacity-10" />
              </div>
            ))
          : filteredVideos.map((video) => (
              <button
                className={cn(
                  'group rounded-xl p-1.5 text-left transition-all',
                  video.id === videoId
                    ? 'bg-white/15 ring-1 ring-white/40'
                    : 'hover:bg-white/10'
                )}
                key={video.id}
                onClick={() => handleVideoSelect(video.id)}
                title={video.title}
                type="button"
              >
                <AspectRatio
                  className="overflow-hidden rounded-lg"
                  ratio={16 / 9}
                >
                  {/** biome-ignore lint/performance/noImgElement: saving on vercel bandwidth */}
                  <img
                    alt={`${video.title} thumbnail`}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    draggable={false}
                    loading="lazy"
                    src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  />
                </AspectRatio>
                <p className="mt-2 truncate px-0.5 font-medium text-[11px] text-white/60 transition-colors group-hover:text-white/90">
                  {video.title}
                </p>
              </button>
            ))}
      </div>
    </div>
  );
};

export default OverlayControls;
