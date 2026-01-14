import { type ToolMetadata } from "xmcp";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { todo } from "../../db/schema/focus";
import { getMcpUserContext } from "../../lib/mcp-auth";

export const schema = {};

export const metadata: ToolMetadata = {
  name: "get-todos",
  description: "Get all todos/tasks from the user's personal todo list. Returns todos sorted by creation date with their completion status.",
  annotations: {
    title: "Get User Todos",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
};

export default async function getTodos() {
  console.log('[MCP Tool] get-todos: Starting execution');
  
  try {
    const ctx = await getMcpUserContext();
    
    if (!ctx) {
      console.log('[MCP Tool] get-todos: ERROR - No user context found');
      return {
        content: [{ type: "text", text: "Not authenticated. Please provide a valid API key or OAuth token." }],
        isError: true,
      };
    }
    
    console.log('[MCP Tool] get-todos: User context retrieved', {
      userId: ctx.userId,
    });
    
    // Fetch todos from the database
    const todos = await db
      .select()
      .from(todo)
      .where(eq(todo.userId, ctx.userId))
      .orderBy(desc(todo.createdAt));
    
    // Format the response
    const formattedTodos = todos.map((t) => ({
      id: t.id,
      title: t.title,
      completed: t.completed,
      canvasAssignmentId: t.canvasAssignmentId,
      canvasCourseId: t.canvasCourseId,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));
    
    // Separate by completion status for easier consumption
    const activeTodos = formattedTodos.filter((t) => !t.completed);
    const completedTodos = formattedTodos.filter((t) => t.completed);
    
    console.log('[MCP Tool] get-todos: SUCCESS', {
      userId: ctx.userId,
      totalCount: formattedTodos.length,
      activeCount: activeTodos.length,
      completedCount: completedTodos.length,
    });
    
    return {
      structuredContent: {
        status: "success",
        result: {
          todos: formattedTodos,
          summary: {
            total: formattedTodos.length,
            active: activeTodos.length,
            completed: completedTodos.length,
          },
        },
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log('[MCP Tool] get-todos: ERROR', { error: errorMessage });
    return {
      content: [{ type: "text", text: errorMessage }],
      isError: true,
    };
  }
}
