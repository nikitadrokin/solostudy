import type { Route } from 'next';
import { redirect } from 'next/navigation';

const Page: React.FC = () => {
  return redirect('/canvas/experimental/study-lab' as Route);
};

export default Page;
