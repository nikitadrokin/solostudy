import type {
  CanvasAssignment,
  CanvasCourse,
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
