import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.VITE_NEON_DATABASE_URL);

async function runMigration() {
  try {
    console.log('Adding category column to goals table...');
    await sql`
      ALTER TABLE goals 
      ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'learning';
    `;
    console.log('Migration successful!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
