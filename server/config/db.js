import pool from '../db/postgres.js';

const connectDB = async () => {
  try {
    // Test the connection
    const client = await pool.connect();
    console.log('PostgreSQL connected');
    client.release();
    
    // Initialize database tables if needed
    await initializeDB();
    
    return pool;
  } catch (error) {
    console.error(`Error connecting to PostgreSQL: ${error.message}`);
    process.exit(1);
  }
};

// Initialize database tables if they don't exist
const initializeDB = async () => {
  try {
    // Check if users table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    // If tables don't exist, create them
    if (!tableCheck.rows[0].exists) {
      console.log('Initializing database tables...');
      
      // Read SQL from db-init.sql file
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      
      const sqlPath = path.join(__dirname, '../../db-init.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      // Execute SQL
      await pool.query(sql);
      console.log('Database tables initialized successfully');
    }
  } catch (error) {
    console.error(`Error initializing database: ${error.message}`);
    throw error;
  }
};

export default connectDB;