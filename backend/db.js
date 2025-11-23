import dotenv from 'dotenv';
dotenv.config();
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL not set. Database calls will fail until configured.');
}

const sql = neon(process.env.DATABASE_URL);

export async function query(text, params = []) {
  // neon tagged template prefers template usage; for parameterized arrays use sql(text, ...params)
  // We keep a consistent interface like pg.query(text, params)
  // When params is an array we spread; neon handles embedded parameters safely.
  return sql(text, ...params);
}

// Helper to run inside transaction if needed later
export async function transaction(fn) {
  return await sql.transaction(fn);
}
