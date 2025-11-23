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
  ssl: { rejectUnauthorized: false }   // Neon requires SSL
});

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function transaction(work) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work((text, params) => client.query(text, params));
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export { pool };
