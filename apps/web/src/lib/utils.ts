import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getXDirectMessageLink(userId?: string) {
  return `https://x.com/messages/compose?recipient_id=${userId}`;
}
