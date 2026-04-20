import type { Route } from 'next';
import { redirect } from 'next/navigation';

export default function StudyPage() {
  redirect('/study/today' as Route);
}
