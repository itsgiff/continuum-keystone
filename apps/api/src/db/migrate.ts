import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

const databaseUrl = process.env.DATABASE_URL || 'file:./data/keystone.db';
const dbPath = databaseUrl.replace('file:', '');

// Ensure data directory exists
await mkdir(dirname(dbPath), { recursive: true });

const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

console.log('Running migrations...');
migrate(db, { migrationsFolder: './src/db/migrations' });
console.log('Migrations complete!');

sqlite.close();
