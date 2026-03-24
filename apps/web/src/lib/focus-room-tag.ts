/** Normalize user input into a URL-safe slug for `focus_room_tag.slug`. */
export function slugifyFocusRoomTagLabel(label: string): string {
  const trimmed = label.trim().toLowerCase();
  const slug = trimmed
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return slug.length > 0 ? slug : 'tag';
}
