import type { InferSchema, ResourceMetadata, ToolSchema } from 'xmcp';
import { z } from 'zod';

export const schema = {
  userId: z.string().describe('The ID of the user'),
} as unknown as ToolSchema;

export const metadata: ResourceMetadata = {
  name: 'user-profile',
  title: 'User Profile',
  description: 'User profile information',
};

export default function handler({ userId }: InferSchema<typeof schema>) {
  return `Profile data for user ${userId}`;
}
