import { TRPCError } from '@trpc/server';
import { desc } from 'drizzle-orm';
import { db } from '../db';
import { focusRoomVideo } from '../db/schema/focus';
import { publicProcedure, router } from '../lib/trpc';

export const focusRouter = router({
  listVideos: publicProcedure.query(async () => {
    try {
      const videos = await db
        .select()
        .from(focusRoomVideo)
        .orderBy(desc(focusRoomVideo.createdAt));

      return videos.map((video) => ({
        id: video.id,
        title: video.title,
        // thumbnail: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
      }));
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to fetch videos: ${error instanceof Error ? error.message : String(error)}`,
        cause: error,
      });
    }
  }),
});
