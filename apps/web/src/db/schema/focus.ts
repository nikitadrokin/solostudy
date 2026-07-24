import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const focusRoomTag = pgTable('focus_room_tag', {
  slug: text('slug').primaryKey(),
  label: text('label').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/** Row in `focus_room_tag`. `slug` is stored on `focus_room_video.tag`. */
export type FocusRoomTagRow = typeof focusRoomTag.$inferSelect;

export const focusRoomVideo = pgTable('focus_room_video', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  tag: text('tag')
    .notNull()
    .default('lofi')
    .references(() => focusRoomTag.slug),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
