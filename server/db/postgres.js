import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'lingualearn',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || "5432"),
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

export default pool;