import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './auth';

export const canvasCourse = pgTable('canvas_course', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  canvasId: integer('canvas_id').notNull(),
  name: text('name').notNull(),
  courseCode: text('course_code'),
  startAt: timestamp('start_at'),
  endAt: timestamp('end_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const canvasAssignment = pgTable('canvas_assignment', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  canvasId: integer('canvas_id').notNull(),
  courseId: text('course_id')
    .notNull()
    .references(() => canvasCourse.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  dueAt: timestamp('due_at'),
  unlockAt: timestamp('unlock_at'),
  lockAt: timestamp('lock_at'),
  pointsPossible: integer('points_possible'),
  submissionTypes: text('submission_types'),
  submitted: boolean('submitted').default(false),
  graded: boolean('graded').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
