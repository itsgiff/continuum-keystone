import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

const databaseUrl = process.env.DATABASE_URL || 'file:./data/keystone.db';
const dbPath = databaseUrl.replace('file:', '');

// Ensure data directory exists
await mkdir(dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

export { schema };
