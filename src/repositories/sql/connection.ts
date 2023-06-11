import { Pool } from 'pg';
import dotenv from 'dotenv'

dotenv.config();
// Create a connection pool
export const pool = new Pool({
  user: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || "5432", 10),
  database: process.env.PG_DB,
});
