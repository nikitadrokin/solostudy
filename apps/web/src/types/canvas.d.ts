/**
 * Canvas API client utilities
 * Handles communication with Instructure Canvas LMS API
 */

export interface CanvasCourse {
  id: number;
  name: string;
  course_code: string;
  start_at: string | null;
  end_at: string | null;
}

export interface CanvasAssignment {
  id: number;
  name: string;
  description: string | null;
  due_at: string | null;
  unlock_at: string | null;
  lock_at: string | null;
  points_possible: number | null;
  submission_types: string[];
  course_id: number;
  has_submitted_submissions?: boolean;
  graded_submissions_exist?: boolean;
}

export interface CanvasUser {
  id: number;
  name: string;
  email: string;
}
