import type { LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XLogoProps extends LucideProps {}

const XLogo: React.FC<XLogoProps> = ({ ...props }) => (
  <svg
    aria-label="Twitter X Streamline Icon"
    className={cn('size-4 stroke-foreground', props.className)}
    fill="currentColor"
    height="16"
    viewBox="0 0 16 16"
    width="16"
    {...props}
  >
    <title>X Logo</title>
    <path
      d="M12.6 0.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867 -5.07 -4.425 5.07H0.316l5.733 -6.57L0 0.75h5.063l3.495 4.633L12.601 0.75Zm-0.86 13.028h1.36L4.323 2.145H2.865z"
      strokeWidth="1"
    />
  </svg>
);

export default XLogo;
