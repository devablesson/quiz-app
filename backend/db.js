// backend/db.js
import dotenv from 'dotenv';
dotenv.config();

import pkg from 'pg';
const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL not set. Database calls will fail until configured.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // Neon requires SSL
});

/**
 * Standard query function that always returns result.rows
 */
export async function query(text, params = []) {
  const result = await pool.query(text, params);
  return result.rows;   // <-- IMPORTANT FIX
}

/**
 * Transaction helper: ensures COMMIT/ROLLBACK
 * run(text, ...params) will return only rows
 */
export async function transaction(work) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const run = async (text, ...params) => {
      const result = await client.query(text, params);
      return result.rows;   // <-- ALSO FIXED
    };

    const output = await work(run);

    await client.query('COMMIT');
    return output;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export { pool };
