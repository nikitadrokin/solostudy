import { headers } from 'next/headers';
import { AuthOverlay } from '@/components/auth-overlay';
import { auth } from '@/lib/auth';
import { api } from '@/trpc/server';
import CanvasUnauthorized from './unauthorized';

type LayoutProps = {
  children: React.ReactNode;
};

const CanvasLayout: React.FC<LayoutProps> = async ({ children }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return <AuthOverlay>{children}</AuthOverlay>;
  }

  // Check if Canvas is connected but don't expose tokens
  const connectedAccount = await api.canvas.checkForExistingToken();

  // If the array has length, the specific conditions were met
  const hasCanvasToken = connectedAccount;

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
