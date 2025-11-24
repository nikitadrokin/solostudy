/** biome-ignore-all lint/suspicious/noConsole: Migration scripts need console output for progress logging */
import { randomUUID } from 'node:crypto';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import playlistData from '../src/data/programming_vibes';
import { focusRoomVideo } from '../src/db/schema/focus';

async function migrateProgrammingVibes() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  try {
    console.log('Starting migration of programming vibes to database...');

    const entries = playlistData.entries;

    console.log(`Found ${entries.length} total entries in playlist`);

    const validEntries = entries.filter((entry) => {
      if (!(entry.id && entry.title)) {
        return false;
      }
      if (entry.title === '[Private video]') {
        return false;
      }
      if (entry.availability === 'private') {
        return false;
      }
      return true;
    });

    console.log(`Filtered to ${validEntries.length} valid entries`);

    const videosToInsert = validEntries.map((entry) => ({
      id: randomUUID(),
      videoId: entry.id,
      videoTitle: entry.title,
    }));

    console.log(`Prepared ${videosToInsert.length} videos for insertion`);

    console.log('Clearing existing videos...');
    await db.delete(focusRoomVideo);

    console.log('Inserting videos in batches...');
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < videosToInsert.length; i += batchSize) {
      const batch = videosToInsert.slice(i, i + batchSize);
      // biome-ignore lint/nursery/noAwaitInLoop: This is a migration script, we can await here
      await db.insert(focusRoomVideo).values(batch);
      inserted += batch.length;
      console.log(`Inserted ${inserted}/${videosToInsert.length} videos`);
    }

    console.log('Migration completed successfully!');
    console.log(`Total videos inserted: ${inserted}`);
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrateProgrammingVibes()
  .then(() => {
    console.log('Migration script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });
