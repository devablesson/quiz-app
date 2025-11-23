import { sql } from './db.js';

async function run() {
  try {
    // Detect columns
    const hasQuestion = await sql`SELECT column_name FROM information_schema.columns WHERE table_name='questions' AND column_name='question'`;
    const hasAnswer = await sql`SELECT column_name FROM information_schema.columns WHERE table_name='questions' AND column_name='answer'`;

    if (hasQuestion.length) {
      try {
        await sql`ALTER TABLE questions RENAME COLUMN question TO text`;
        console.log('Renamed column question -> text');
      } catch (e) {
        console.warn('Rename question->text skipped:', e.message);
      }
    }
    if (hasAnswer.length) {
      try {
        await sql`ALTER TABLE questions RENAME COLUMN answer TO correct_option`;
        console.log('Renamed column answer -> correct_option');
      } catch (e) {
        console.warn('Rename answer->correct_option skipped:', e.message);
      }
    }

    // Legacy 'type' column removal or relaxation
    const hasType = await sql`SELECT column_name FROM information_schema.columns WHERE table_name='questions' AND column_name='type'`;
    if (hasType.length) {
      try {
        // Drop if unused by current controllers
        await sql`ALTER TABLE questions DROP COLUMN type`;
        console.log('Dropped legacy column type');
      } catch (e) {
        console.warn('Drop type column failed:', e.message);
        // Fallback: make it nullable
        try { await sql`ALTER TABLE questions ALTER COLUMN type DROP NOT NULL`; console.log('Made type column nullable'); } catch {}
      }
    }

    // Ensure NOT NULL constraints for active columns
    try { await sql`ALTER TABLE questions ALTER COLUMN options SET NOT NULL`; } catch {}
    try { await sql`ALTER TABLE questions ALTER COLUMN correct_option SET NOT NULL`; } catch {}

    console.log('Schema fix complete.');
    process.exit(0);
  } catch (err) {
    console.error('Schema fix failed:', err);
    process.exit(1);
  }
}

run();
