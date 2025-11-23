import dotenv from 'dotenv';
dotenv.config();
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL not set. Database calls will fail until configured.');
}

const sql = neon(process.env.DATABASE_URL);

function buildTemplate(text, params) {
  const parts = [];
  const values = [];
  let lastIndex = 0;
  const regex = /\$([0-9]+)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    parts.push(text.slice(lastIndex, match.index));
    const idx = Number(match[1]) - 1;
    values.push(params[idx]);
    lastIndex = match.index + match[0].length;
  }
  parts.push(text.slice(lastIndex));
  return sql(parts, ...values);
}

export async function query(text, params = []) {
  const list = Array.isArray(params) ? params : [params];
  if (/\$[0-9]+/.test(text)) return buildTemplate(text, list);
  return sql([text]);
}

export async function transaction(work) {
  await sql`BEGIN`;
  try {
    const result = await work((text, ...params) => {
      if (/\$[0-9]+/.test(text)) return buildTemplate(text, params);
      return sql([text]);
    });
    await sql`COMMIT`;
    return result;
  } catch (err) {
    try { await sql`ROLLBACK`; } catch {}
    throw err;
  }
}

export { sql }; // expose raw tagged template for migrations
