import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.VITE_NEON_DATABASE_URL);

async function testInsert() {
  try {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    console.log('Testing insert...');
    const result = await sql('INSERT INTO goals (user_id, name, category) VALUES ($1, $2, $3) RETURNING *', [userId, 'Test Goal', 'learning']);
    console.log('Insert success:', result);

    const goals = await sql('SELECT * FROM goals');
    console.log('All goals:', goals);

  } catch (err) {
    console.error('Test failed:', err);
  }
}

testInsert();
