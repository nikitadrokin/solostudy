import type {
  CanvasAnnouncement,
  CanvasAssignment,
  CanvasAssignmentGroup,
  CanvasAssignmentWithSubmission,
  CanvasCalendarEvent,
  CanvasCourse,
  CanvasCredentials,
  CanvasDiscussionEntry,
  CanvasDiscussionTopic,
  CanvasEnrollment,
  CanvasFile,
  CanvasUser,
} from "../types/canvas";

const LINK_REGEX = /<([^>]+)>/;
const TRAILING_SLASH_REGEX = /\/$/;

/**
 * Normalizes Canvas URL to ensure it has the correct format
 */
export function normalizeCanvasUrl(url: string): string {
  let normalized = url.trim();
  if (!(normalized.startsWith("http://") || normalized.startsWith("https://"))) {
    normalized = `https://${normalized}`;
  }
  normalized = normalized.replace(TRAILING_SLASH_REGEX, "");
  return normalized;
}

/**
 * Get the API URL from a Canvas URL
 */
export function getApiUrl(canvasUrl: string): string {
  return `${normalizeCanvasUrl(canvasUrl)}/api/v1`;
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
  const linkHeader = response.headers.get("Link");
  const nextLink = linkHeader
    ?.split(",")
    .find((link) => link.includes('rel="next"'))
    ?.match(LINK_REGEX)?.[1];

  if (nextLink) {
    return fetchPaginatedData(nextLink, accessToken, accumulator);
  }

  return accumulator;
}

/**
 * Fetches user information from Canvas API
 */
export async function fetchCanvasUser(
  credentials: CanvasCredentials
): Promise<CanvasUser> {
  const apiUrl = getApiUrl(credentials.canvasUrl);
  const response = await fetch(`${apiUrl}/users/self`, {
    headers: {
      Authorization: `Bearer ${credentials.accessToken}`,
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
 * Fetches all courses for the authenticated user
 */
export async function fetchCanvasCourses(
  credentials: CanvasCredentials
): Promise<CanvasCourse[]> {
  const apiUrl = getApiUrl(credentials.canvasUrl);
  const initialUrl = `${apiUrl}/courses?enrollment_type=student&enrollment_state=active&per_page=100`;
  return await fetchPaginatedData<CanvasCourse>(
    initialUrl,
    credentials.accessToken,
    []
  );
}

/**
 * Fetches assignments for a specific course
 */
export async function fetchCourseAssignments(
  credentials: CanvasCredentials,
  courseId: number
): Promise<CanvasAssignment[]> {
  const apiUrl = getApiUrl(credentials.canvasUrl);
  const initialUrl = `${apiUrl}/courses/${courseId}/assignments?per_page=100`;
  return await fetchPaginatedData<CanvasAssignment>(
    initialUrl,
    credentials.accessToken,
    []
  );
}

/**
 * Fetches all assignments across all courses
 */
export async function fetchAllAssignments(
  credentials: CanvasCredentials
): Promise<CanvasAssignment[]> {
  const courses = await fetchCanvasCourses(credentials);

  const assignmentPromises = courses.map(async (course) => {
    try {
      return await fetchCourseAssignments(credentials, course.id);
    } catch {
      return [];
    }
  });

  const assignmentArrays = await Promise.all(assignmentPromises);
  return assignmentArrays.flat();
}

/**
 * Fetches user's own enrollment for a course (for getting grades)
 */
export async function fetchUserEnrollment(
  credentials: CanvasCredentials,
  courseId: number,
  userId: number
): Promise<CanvasEnrollment | null> {
  const apiUrl = getApiUrl(credentials.canvasUrl);
  const response = await fetch(
    `${apiUrl}/courses/${courseId}/enrollments?user_id=${userId}&include[]=current_grading_period_scores`,
    {
      headers: {
        Authorization: `Bearer ${credentials.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const enrollments: CanvasEnrollment[] = await response.json();
  return enrollments.find((e) => e.type === "StudentEnrollment") ?? null;
}

/**
 * Fetches calendar events for specified courses
 */
export async function fetchCalendarEvents(
  credentials: CanvasCredentials,
  contextCodes: string[],
  startDate: string,
  endDate: string
): Promise<CanvasCalendarEvent[]> {
  const apiUrl = getApiUrl(credentials.canvasUrl);
  const contextParams = contextCodes
    .map((code) => `context_codes[]=${code}`)
    .join("&");
  const initialUrl = `${apiUrl}/calendar_events?${contextParams}&start_date=${startDate}&end_date=${endDate}&type=event&per_page=100`;

  return await fetchPaginatedData<CanvasCalendarEvent>(
    initialUrl,
    credentials.accessToken,
    []
  );
}

/**
 * Fetches announcements for specified courses
 */
export async function fetchAnnouncements(
  credentials: CanvasCredentials,
  contextCodes: string[]
): Promise<CanvasAnnouncement[]> {
  const apiUrl = getApiUrl(credentials.canvasUrl);
  const contextParams = contextCodes
    .map((code) => `context_codes[]=${code}`)
    .join("&");
  const initialUrl = `${apiUrl}/announcements?${contextParams}&per_page=50`;

  return await fetchPaginatedData<CanvasAnnouncement>(
    initialUrl,
    credentials.accessToken,
    []
  );
}

/**
 * Fetches assignment groups with weights for a course
 */
export async function fetchAssignmentGroups(
  credentials: CanvasCredentials,
  courseId: number
): Promise<CanvasAssignmentGroup[]> {
  const apiUrl = getApiUrl(credentials.canvasUrl);
  const initialUrl = `${apiUrl}/courses/${courseId}/assignment_groups?per_page=100`;
  return await fetchPaginatedData<CanvasAssignmentGroup>(
    initialUrl,
    credentials.accessToken,
    []
  );
}

/**
 * Fetches assignments with submission data for a course
 */
export async function fetchAssignmentsWithSubmissions(
  credentials: CanvasCredentials,
  courseId: number
): Promise<CanvasAssignmentWithSubmission[]> {
  const apiUrl = getApiUrl(credentials.canvasUrl);
  const initialUrl = `${apiUrl}/courses/${courseId}/assignments?include[]=submission&per_page=100`;
  return await fetchPaginatedData<CanvasAssignmentWithSubmission>(
    initialUrl,
    credentials.accessToken,
    []
  );
}

/**
 * Fetches discussion topics for a specific course
 */
export async function fetchCourseDiscussionTopics(
  credentials: CanvasCredentials,
  courseId: number
): Promise<CanvasDiscussionTopic[]> {
  const apiUrl = getApiUrl(credentials.canvasUrl);
  const initialUrl = `${apiUrl}/courses/${courseId}/discussion_topics?per_page=100`;
  return await fetchPaginatedData<CanvasDiscussionTopic>(
    initialUrl,
    credentials.accessToken,
    []
  );
}

/**
 * Fetches entries for a specific discussion topic
 */
export async function fetchDiscussionEntries(
  credentials: CanvasCredentials,
  courseId: number,
  topicId: number
): Promise<CanvasDiscussionEntry[]> {
  const apiUrl = getApiUrl(credentials.canvasUrl);
  const initialUrl = `${apiUrl}/courses/${courseId}/discussion_topics/${topicId}/entries?per_page=100`;
  try {
    return await fetchPaginatedData<CanvasDiscussionEntry>(
      initialUrl,
      credentials.accessToken,
      []
    );
  } catch {
    return [];
  }
}

/**
 * Fetches files for a specific course
 */
export async function fetchCourseFiles(
  credentials: CanvasCredentials,
  courseId: number
): Promise<CanvasFile[]> {
  const apiUrl = getApiUrl(credentials.canvasUrl);
  const initialUrl = `${apiUrl}/courses/${courseId}/files?per_page=100`;
  try {
    return await fetchPaginatedData<CanvasFile>(
      initialUrl,
      credentials.accessToken,
      []
    );
  } catch {
    return [];
  }
}
