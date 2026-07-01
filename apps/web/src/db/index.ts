import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

const client = new Database(
  process.env.DATABASE_URL || '/app/data/database.db'
);
export const db = drizzle(client);

migrate(db, { migrationsFolder: './src/db/migrations' });
