import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './auth';

export const todo = pgTable('todo', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  completed: boolean('completed').notNull().default(false),
  canvasAssignmentId: text('canvas_assignment_id'),
  canvasCourseId: text('canvas_course_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

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

export const focusSession = pgTable('focus_session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  durationSeconds: integer('duration_seconds').notNull(),
  startedAt: timestamp('started_at').notNull(),
  endedAt: timestamp('ended_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
