import { and, eq, isNotNull } from 'drizzle-orm';
import { headers } from 'next/headers';
import { AuthOverlay } from '@/components/auth-overlay';
import { db } from '@/db';
import { user } from '@/db/schema/auth';
import { auth } from '@/lib/auth';
import CanvasUnauthorized from './unauthorized';

type LayoutProps = {
  children: React.ReactNode;
};

const CanvasLayout: React.FC<LayoutProps> = async ({ children }) => {
  'use cache: private';

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <AuthOverlay>{children}</AuthOverlay>;
  }

  // Check if Canvas is connected but don't expose
  const connectedAccount = await db
    .select({ id: user.id }) // Select only ID (tiny data)
    .from(user)
    .where(
      and(
        eq(user.id, session.user.id),
        isNotNull(user.canvasIntegrationToken), // SQL checks if token exists
        isNotNull(user.canvasUrl) // SQL checks if URL exists
      )
    )
    .limit(1);

  // If the array has length, the specific conditions were met
  const hasCanvasToken = connectedAccount.length > 0;

  if (!hasCanvasToken) {
    return (
      <AuthOverlay>
        <CanvasUnauthorized />
      </AuthOverlay>
    );
  }

  return <AuthOverlay>{children}</AuthOverlay>;
};

export default CanvasLayout;
