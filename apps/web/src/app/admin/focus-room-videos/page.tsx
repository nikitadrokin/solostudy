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
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl">Focus room videos</h1>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-800 text-xs dark:bg-amber-900/30 dark:text-amber-400">
              Admin
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage the YouTube videos and category tags shown in the focus room.
          </p>
        </div>
      </div>
      <FocusRoomVideosAdmin />
    </div>
  );
}
