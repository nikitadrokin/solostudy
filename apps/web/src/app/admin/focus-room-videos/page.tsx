import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import FocusRoomVideosAdmin from '@/components/admin/focus-room-videos';
import { auth } from '@/lib/auth';

export default async function AdminFocusRoomVideosPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
    redirect('/');
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6 md:p-8">
      <h1 className="font-bold text-2xl">Focus room videos</h1>
      <FocusRoomVideosAdmin />
    </div>
  );
}
