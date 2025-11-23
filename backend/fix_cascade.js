import { sql } from './db.js';

async function run() {
  try {
    console.log('Fixing foreign key constraint to enable CASCADE delete...');
    
    // Drop existing foreign key constraint
    await sql`
      ALTER TABLE questions 
      DROP CONSTRAINT IF EXISTS questions_quiz_id_fkey
    `;
    console.log('Dropped old foreign key constraint');
    
    // Add new foreign key constraint with CASCADE delete
    await sql`
      ALTER TABLE questions 
      ADD CONSTRAINT questions_quiz_id_fkey 
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) 
      ON DELETE CASCADE
    `;
    console.log('Added new foreign key constraint with CASCADE delete');
    
    console.log('✓ Foreign key constraint fixed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Failed to fix cascade:', err);
    process.exit(1);
  }
}

run();
