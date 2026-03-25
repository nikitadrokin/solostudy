/**
 * One-time: set `focus_room_video.tag` from curated title-based categories.
 * Run after migration adds `tag`. Requires DATABASE_URL (e.g. dotenv in apps/web).
 */
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { focusRoomTag, focusRoomVideo } from '../src/db/schema/focus';

type FocusTagSlug =
  | 'lofi'
  | 'christmas'
  | 'city'
  | 'cafe'
  | 'library'
  | 'dark-academia'
  | 'nature'
  | 'rainy'
  | 'fireplace';

const REQUIRED_TAGS: Array<{ slug: FocusTagSlug; label: string; sortOrder: number }> = [
  { slug: 'lofi', label: 'Lofi', sortOrder: 0 },
  { slug: 'christmas', label: 'Christmas', sortOrder: 1 },
  { slug: 'city', label: 'City', sortOrder: 2 },
  { slug: 'cafe', label: 'Cafe', sortOrder: 3 },
  { slug: 'library', label: 'Library', sortOrder: 4 },
  { slug: 'dark-academia', label: 'Dark Academia', sortOrder: 5 },
  { slug: 'nature', label: 'Nature', sortOrder: 6 },
  { slug: 'rainy', label: 'Rainy', sortOrder: 7 },
  { slug: 'fireplace', label: 'Fireplace', sortOrder: 8 },
];

const RAINY_KEYWORDS = [
  'rainy',
  ' rain ',
  ' rain,',
  ' rain-',
  ' rain|',
  ' rain/',
  'raining',
  'thunder',
  'storm',
  'drizzle',
  'asmr while working overtime on a rainy day',
];

const FIREPLACE_KEYWORDS = [
  'fireplace',
  'fireside',
  'crackling fire',
  'fire sounds',
];

const DARK_ACADEMIA_KEYWORDS = [
  'dark academia',
  'ancient university',
  'ancient library',
  'oxford library',
  'ancient academy',
];

const NATURE_KEYWORDS = [
  'forest',
  'glasshouse',
  'cottage',
  'seaside',
  'beach',
  'canal',
  'waves',
  'wood cabin',
  'snow falling in a forest',
];

const CHRISTMAS_KEYWORDS = ['christmas', 'festive', 'holiday', 'winter', 'snow'];

const CAFE_KEYWORDS = ['coffee shop', 'jazz cafe', 'cafe'];

const LIBRARY_KEYWORDS = ['library', 'study room', 'study desk', 'exam', 'studying'];

const CITY_KEYWORDS = [
  'city',
  'tokyo',
  'paris',
  'kyoto',
  'osaka',
  'new york',
  'brooklyn',
  'london',
  'amsterdam',
  'venice',
  'rooftop',
  'skyscraper',
  'big ben',
  'los angeles',
];

const MANUAL_OVERRIDES: Record<string, FocusTagSlug> = {
  Zhaz_30H_0w: 'dark-academia',
  'Ewg1T-VQOe4': 'dark-academia',
  SllpB3W5f6s: 'dark-academia',
  iTC49Hi4hb8: 'dark-academia',
  'pjrye-ZSZ-8': 'dark-academia',
  pvbX0WOfmlc: 'dark-academia',
  '5RbH5sc6v2Y': 'fireplace',
  SC_Uf73_jS4: 'fireplace',
  '4M9qCyxSiJs': 'fireplace',
  ZjQjmsA5QAg: 'fireplace',
  '1PM6jckIb3U': 'nature',
  xKsiaTTq2p0: 'nature',
  RD929GWcPxo: 'nature',
  r6OMabWgJtg: 'nature',
  XEZqqJ2GCQk: 'nature',
  u9vK5utTcxE: 'nature',
};

function hasKeyword(title: string, keywords: string[]): boolean {
  for (const keyword of keywords) {
    if (title.includes(keyword)) {
      return true;
    }
  }
  return false;
}

function classifyTag(id: string, title: string): FocusTagSlug {
  const override = MANUAL_OVERRIDES[id];
  if (override) {
    return override;
  }

  const normalized = ` ${title.toLowerCase()} `;

  if (hasKeyword(normalized, DARK_ACADEMIA_KEYWORDS)) {
    return 'dark-academia';
  }
  if (hasKeyword(normalized, FIREPLACE_KEYWORDS)) {
    return 'fireplace';
  }
  if (hasKeyword(normalized, RAINY_KEYWORDS)) {
    return 'rainy';
  }
  if (hasKeyword(normalized, NATURE_KEYWORDS)) {
    return 'nature';
  }
  if (hasKeyword(normalized, CHRISTMAS_KEYWORDS)) {
    return 'christmas';
  }
  if (hasKeyword(normalized, CAFE_KEYWORDS)) {
    return 'cafe';
  }
  if (hasKeyword(normalized, LIBRARY_KEYWORDS)) {
    return 'library';
  }
  if (hasKeyword(normalized, CITY_KEYWORDS)) {
    return 'city';
  }
  return 'lofi';
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new pg.Pool({ connectionString: url });
  const db = drizzle(pool);

  const now = new Date();
  await Promise.all(
    REQUIRED_TAGS.map((tag) =>
      db
        .insert(focusRoomTag)
        .values({
          slug: tag.slug,
          label: tag.label,
          sortOrder: tag.sortOrder,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: focusRoomTag.slug,
          set: {
            label: tag.label,
            sortOrder: tag.sortOrder,
            updatedAt: now,
          },
        })
    )
  );

  const videos = await db
    .select({ id: focusRoomVideo.id, title: focusRoomVideo.title })
    .from(focusRoomVideo);

  const updatedAt = new Date();
  await Promise.all(
    videos.map((video) =>
      db
        .update(focusRoomVideo)
        .set({
          tag: classifyTag(video.id, video.title),
          updatedAt,
        })
        .where(eq(focusRoomVideo.id, video.id))
    )
  );

  await pool.end();
}

main().catch((error: unknown) => {
  process.exitCode = 1;
  throw error;
});
