import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.VITE_NEON_DATABASE_URL);

/**
 * Initialize the database tables.
 */
async function setupDatabase() {
  try {
    console.log('Dropping existing tables to reset schema...');
    await sql`DROP TABLE IF EXISTS entries CASCADE`;
    await sql`DROP TABLE IF EXISTS goals CASCADE`;
    await sql`DROP TABLE IF EXISTS users CASCADE`;

    console.log('Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('Creating goals table...');
    await sql`
      CREATE TABLE IF NOT EXISTS goals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        category TEXT DEFAULT 'learning',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('Creating entries table...');
    await sql`
      CREATE TABLE IF NOT EXISTS entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        drive INTEGER DEFAULT 5,
        energy INTEGER DEFAULT 5,
        focus INTEGER DEFAULT 5,
        clarity INTEGER DEFAULT 5,
        took_action BOOLEAN DEFAULT FALSE,
        impact_level INTEGER DEFAULT 5,
        action_note TEXT,
        blocker TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(goal_id, date)
      );
    `;

    console.log('Database setup complete!');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
