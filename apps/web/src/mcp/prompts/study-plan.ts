import { z } from "zod";
import { type InferSchema, type PromptMetadata } from "xmcp";

export const schema = {
  assignments: z.string().describe("JSON string of the user's assignments from get-user-assignments tool"),
  focusTime: z.string().optional().describe("How many hours per day available for studying (e.g., '2-3 hours')"),
};

export const metadata: PromptMetadata = {
  name: "study-plan",
  title: "Create Study Plan",
  description: "Generate a personalized study plan based on your upcoming Canvas assignments and deadlines",
  role: "user",
};

export default function studyPlan({ assignments, focusTime }: InferSchema<typeof schema>) {
  const timeContext = focusTime 
    ? `I have approximately ${focusTime} available for studying each day.`
    : "Please estimate reasonable study times.";

  return `Based on my upcoming assignments, create a personalized study plan.

${timeContext}

Here are my current assignments from Canvas:
\`\`\`json
${assignments}
\`\`\`

Please:
1. Prioritize assignments by due date and point value
2. Break down larger assignments into smaller, manageable tasks
3. Suggest a daily/weekly schedule
4. Identify any potential conflicts or tight deadlines
5. Recommend focus session durations (25-50 minute blocks work well)

Format the plan in a clear, actionable way that I can follow.`;
}
