import type {
  CanvasAnnouncement,
  CanvasAssignment,
  CanvasAssignmentGroup,
  CanvasAssignmentWithSubmission,
  CanvasCalendarEvent,
  CanvasCourse,
  CanvasDiscussionEntry,
  CanvasDiscussionTopic,
  CanvasEnrollment,
  CanvasFile,
  CanvasUser,
} from '../types/canvas';

const LINK_REGEX = /<([^>]+)>/;
const TRAILING_SLASH_REGEX = /\/$/;

/**
 * Fetches user information from Canvas API
 */
export async function fetchCanvasUser(
  canvasUrl: string,
  accessToken: string
): Promise<CanvasUser> {
  const response = await fetch(`${canvasUrl}/users/self`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Canvas API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Fetches paginated data from Canvas API
 */
async function fetchPaginatedData<T>(
  url: string,
  accessToken: string,
  accumulator: T[]
): Promise<T[]> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Canvas API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  accumulator.push(...data);

  // Handle pagination
  const linkHeader = response.headers.get('Link');
  const nextLink = linkHeader
    ?.split(',')
    .find((link) => link.includes('rel="next"'))
    ?.match(LINK_REGEX)?.[1];

  if (nextLink) {
    return fetchPaginatedData(nextLink, accessToken, accumulator);
  }

  return accumulator;
}

/**
 * Fetches all courses for the authenticated user
 */
export async function fetchCanvasCourses(
  canvasUrl: string,
  accessToken: string
): Promise<CanvasCourse[]> {
  const initialUrl = `${canvasUrl}/courses?enrollment_type=student&enrollment_state=active&per_page=100`;
  return await fetchPaginatedData<CanvasCourse>(initialUrl, accessToken, []);
}

/**
 * Fetches assignments for a specific course
 */
export async function fetchCourseAssignments(
  canvasUrl: string,
  accessToken: string,
  courseId: number
): Promise<CanvasAssignment[]> {
  const initialUrl = `${canvasUrl}/courses/${courseId}/assignments?per_page=100`;
  return await fetchPaginatedData<CanvasAssignment>(
    initialUrl,
    accessToken,
    []
  );
}

/**
 * Fetches all assignments across all courses
 */
export async function fetchAllAssignments(
  canvasUrl: string,
  accessToken: string
): Promise<CanvasAssignment[]> {
  const courses = await fetchCanvasCourses(canvasUrl, accessToken);

  const assignmentPromises = courses.map(async (course) => {
    try {
      return await fetchCourseAssignments(canvasUrl, accessToken, course.id);
    } catch {
      // Skip courses that fail (might be archived or inaccessible)
      return [];
    }
  });

  const assignmentArrays = await Promise.all(assignmentPromises);
  return assignmentArrays.flat();
}

/**
 * Fetches enrollments for a specific course with grade information
 */
export async function fetchCourseEnrollments(
  canvasUrl: string,
  accessToken: string,
  courseId: number
): Promise<CanvasEnrollment[]> {
  const initialUrl = `${canvasUrl}/courses/${courseId}/enrollments?type[]=StudentEnrollment&include[]=current_grading_period_scores&per_page=100`;
  return await fetchPaginatedData<CanvasEnrollment>(
    initialUrl,
    accessToken,
    []
  );
}

/**
 * Fetches user's own enrollment for a course (for getting grades)
 */
export async function fetchUserEnrollment(
  canvasUrl: string,
  accessToken: string,
  courseId: number,
  userId: number
): Promise<CanvasEnrollment | null> {
  const response = await fetch(
    `${canvasUrl}/courses/${courseId}/enrollments?user_id=${userId}&include[]=current_grading_period_scores`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const enrollments: CanvasEnrollment[] = await response.json();
  return enrollments.find((e) => e.type === 'StudentEnrollment') ?? null;
}

/**
 * Fetches calendar events for specified courses
 */
export async function fetchCalendarEvents(
  canvasUrl: string,
  accessToken: string,
  contextCodes: string[],
  startDate: string,
  endDate: string
): Promise<CanvasCalendarEvent[]> {
  const contextParams = contextCodes
    .map((code) => `context_codes[]=${code}`)
    .join('&');
  const initialUrl = `${canvasUrl}/calendar_events?${contextParams}&start_date=${startDate}&end_date=${endDate}&type=event&per_page=100`;

  try {
    return await fetchPaginatedData<CanvasCalendarEvent>(
      initialUrl,
      accessToken,
      []
    );
  } catch (error) {
    if (error instanceof Error) {
      throw formattedCanvasError(error);
    }

    throw new Error('Failed to fetch calendar events from Canvas API');
  }
}

/**
 * Fetches announcements for specified courses
 */
export async function fetchAnnouncements(
  canvasUrl: string,
  accessToken: string,
  contextCodes: string[]
): Promise<CanvasAnnouncement[]> {
  const contextParams = contextCodes
    .map((code) => `context_codes[]=${code}`)
    .join('&');
  const initialUrl = `${canvasUrl}/announcements?${contextParams}&per_page=50`;

  try {
    return await fetchPaginatedData<CanvasAnnouncement>(
      initialUrl,
      accessToken,
      []
    );
  } catch (error) {
    // Check if it's a rate limit error (429) or other API errors
    if (error instanceof Error) {
      // If the error message contains rate limit information, throw it

      throw formattedCanvasError(error);
    }
    // If it's not an Error instance, throw a generic error
    throw new Error('Failed to fetch announcements from Canvas API');
  }
}

/**
 * Validates a Canvas access token by attempting to fetch user info
 */
export async function validateCanvasToken(
  canvasUrl: string,
  accessToken: string
): Promise<boolean> {
  try {
    await fetchCanvasUser(canvasUrl, accessToken);
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalizes Canvas URL to ensure it has the correct format
 */
export function normalizeCanvasUrl(url: string): string {
  let normalized = url.trim();
  if (
    !(normalized.startsWith('http://') || normalized.startsWith('https://'))
  ) {
    normalized = `https://${normalized}`;
  }
  // Remove trailing slash
  normalized = normalized.replace(TRAILING_SLASH_REGEX, '');
  return normalized;
}

function formattedCanvasError(error: Error): Error {
  if (
    error.message.includes('429') ||
    error.message.toLowerCase().includes('rate limit')
  ) {
    throw new Error('Canvas API rate limit exceeded. Please try again later.');
  }
  // For other API errors, throw with more context
  if (error.message.includes('401')) {
    throw new Error(
      'Canvas API authentication failed. Please check your access token.'
    );
  }
  if (error.message.includes('403')) {
    throw new Error(
      'Canvas API access forbidden. Please check your permissions.'
    );
  }
  if (error.message.includes('404')) {
    throw new Error(
      'Canvas API endpoint not found. Please check your Canvas URL.'
    );
  }

  // For other errors, throw the original error
  throw error;
}

/**
 * Fetches assignment groups with weights for a course
 */
export async function fetchAssignmentGroups(
  canvasUrl: string,
  accessToken: string,
  courseId: number
): Promise<CanvasAssignmentGroup[]> {
  const initialUrl = `${canvasUrl}/courses/${courseId}/assignment_groups?per_page=100`;
  return await fetchPaginatedData<CanvasAssignmentGroup>(
    initialUrl,
    accessToken,
    []
  );
}

export async function fetchAssignmentsWithSubmissions(
  canvasUrl: string,
  accessToken: string,
  courseId: number
): Promise<CanvasAssignmentWithSubmission[]> {
  const initialUrl = `${canvasUrl}/courses/${courseId}/assignments?include[]=submission&per_page=100`;
  return await fetchPaginatedData<CanvasAssignmentWithSubmission>(
    initialUrl,
    accessToken,
    []
  );
}

/**
 * Fetches discussion topics for a specific course
 */
export async function fetchCourseDiscussionTopics(
  canvasUrl: string,
  accessToken: string,
  courseId: number
): Promise<CanvasDiscussionTopic[]> {
  const initialUrl = `${canvasUrl}/courses/${courseId}/discussion_topics?per_page=100`;
  return await fetchPaginatedData<CanvasDiscussionTopic>(
    initialUrl,
    accessToken,
    []
  );
}

/**
 * Fetches entries for a specific discussion topic
 */
export async function fetchDiscussionEntries(
  canvasUrl: string,
  accessToken: string,
  courseId: number,
  topicId: number
): Promise<CanvasDiscussionEntry[]> {
  const initialUrl = `${canvasUrl}/courses/${courseId}/discussion_topics/${topicId}/entries?per_page=100`;
  try {
    return await fetchPaginatedData<CanvasDiscussionEntry>(
      initialUrl,
      accessToken,
      []
    );
  } catch {
    // Some topics may not allow viewing entries (require_initial_post)
    return [];
  }
}

/**
 * Fetches files for a specific course
 */
export async function fetchCourseFiles(
  canvasUrl: string,
  accessToken: string,
  courseId: number
): Promise<CanvasFile[]> {
  const initialUrl = `${canvasUrl}/courses/${courseId}/files?per_page=100`;
  try {
    return await fetchPaginatedData<CanvasFile>(initialUrl, accessToken, []);
  } catch {
    // Some courses may not allow viewing files
    return [];
  }
}
