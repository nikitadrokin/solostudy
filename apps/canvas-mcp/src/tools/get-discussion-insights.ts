import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";
import { 
  fetchCanvasCourses, 
  fetchCanvasUser,
  fetchCourseDiscussionTopics,
  fetchDiscussionEntries,
} from "../lib/canvas";

export const schema = {
  canvasUrl: z.string().describe("Canvas LMS URL (e.g., https://school.instructure.com)"),
  accessToken: z.string().describe("Canvas API access token"),
};

export const metadata: ToolMetadata = {
  name: "get-discussion-insights",
  description: "Get unanswered discussion topics where the user hasn't posted yet, with urgency status",
  annotations: {
    title: "Get Discussion Insights",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getDiscussionInsights({ canvasUrl, accessToken }: InferSchema<typeof schema>) {
  const credentials = { canvasUrl, accessToken };
  
  const [courses, canvasUser] = await Promise.all([
    fetchCanvasCourses(credentials),
    fetchCanvasUser(credentials),
  ]);
  
  const now = new Date();

  // Data structure for unanswered discussions
  const unansweredDiscussions: Array<{
    id: number;
    title: string;
    courseId: number;
    courseName: string;
    dueAt: string | null;
    postedAt: string | null;
    daysUntilDue: number | null;
    status: 'overdue' | 'urgent' | 'upcoming' | 'later' | 'no-due-date';
    htmlUrl: string;
  }> = [];

  let totalDiscussions = 0;
  let userPostCount = 0;

  // Fetch discussion topics for each course
  const courseDataPromises = courses.map(async (course) => {
    try {
      const topics = await fetchCourseDiscussionTopics(credentials, course.id);
      return { course, topics };
    } catch {
      return { course, topics: [] };
    }
  });

  const courseData = await Promise.all(courseDataPromises);

  // Process each course's discussions
  for (const { course, topics } of courseData) {
    // Filter to published topics only
    const publishedTopics = topics.filter((t) => t.published);
    totalDiscussions += publishedTopics.length;

    // Check each topic for user participation
    for (const topic of publishedTopics) {
      // Fetch entries to check if user has posted
      const entries = await fetchDiscussionEntries(
        credentials,
        course.id,
        topic.id
      );

      // Check if user has any non-deleted entries
      const userEntries = entries.filter(
        (e) => e.user_id === canvasUser.id && !e.deleted
      );
      userPostCount += userEntries.length;

      // If user hasn't posted, add to unanswered list
      if (userEntries.length === 0) {
        // Calculate days until due
        let daysUntilDue: number | null = null;
        let status: 'overdue' | 'urgent' | 'upcoming' | 'later' | 'no-due-date' = 'no-due-date';

        if (topic.due_at) {
          const dueDate = new Date(topic.due_at);
          daysUntilDue = Math.ceil(
            (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysUntilDue < 0) {
            status = 'overdue';
          } else if (daysUntilDue <= 2) {
            status = 'urgent';
          } else if (daysUntilDue <= 7) {
            status = 'upcoming';
          } else {
            status = 'later';
          }
        }

        unansweredDiscussions.push({
          id: topic.id,
          title: topic.title,
          courseId: course.id,
          courseName: course.name,
          dueAt: topic.due_at,
          postedAt: topic.posted_at,
          daysUntilDue,
          status,
          htmlUrl: topic.html_url,
        });
      }
    }
  }

  // Sort unanswered discussions by urgency (overdue first, then by due date)
  unansweredDiscussions.sort((a, b) => {
    // Overdue first
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (b.status === 'overdue' && a.status !== 'overdue') return 1;
    // Then by days until due
    if (a.daysUntilDue !== null && b.daysUntilDue !== null) {
      return a.daysUntilDue - b.daysUntilDue;
    }
    return 0;
  });

  const summary = {
    totalDiscussions,
    unansweredCount: unansweredDiscussions.length,
    urgentCount: unansweredDiscussions.filter((d) => d.status === 'urgent').length,
    overdueCount: unansweredDiscussions.filter((d) => d.status === 'overdue').length,
    userPostCount,
  };

  return {
    summary,
    unansweredDiscussions,
  };
}
