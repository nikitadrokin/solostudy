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

export interface CanvasGrades {
  current_score: number | null;
  current_grade: string | null;
  final_score: number | null;
  final_grade: string | null;
}

export interface CanvasEnrollment {
  id: number;
  course_id: number;
  user_id: number;
  type: string;
  enrollment_state: string;
  grades?: CanvasGrades;
}

export interface CanvasCalendarEvent {
  id: number;
  title: string;
  description: string | null;
  start_at: string | null;
  end_at: string | null;
  all_day: boolean;
  context_code: string;
  context_name: string;
  workflow_state: string;
  html_url: string;
  type: 'event' | 'assignment';
  assignment?: {
    id: number;
    name: string;
    due_at: string | null;
  };
}

export interface CanvasAnnouncement {
  id: number;
  title: string;
  message: string;
  posted_at: string;
  delayed_post_at: string | null;
  context_code: string;
  html_url: string;
  user_name: string;
  read_state: string;
}

export interface CanvasAssignmentGroup {
  id: number;
  name: string;
  position: number;
  group_weight: number;
  rules?: {
    drop_lowest?: number;
    drop_highest?: number;
    never_drop?: number[];
  };
}

export interface CanvasSubmission {
  id: number;
  assignment_id: number;
  user_id: number;
  score: number | null;
  grade: string | null;
  submitted_at: string | null;
  workflow_state: string;
  late: boolean;
  missing: boolean;
  excused: boolean;
}

export interface CanvasAssignmentWithSubmission extends CanvasAssignment {
  submission?: CanvasSubmission;
  assignment_group_id: number;
}

