import pkg from 'pg';
import dotenv from 'dotenv';
import {fileURLToPath} from "url";
import path ,{dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env")});

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,       
  host: process.env.DB_HOST,       
  database: process.env.DB_DBNAME,   
  password: String(process.env.DB_PASSWORD),  
  port:process.env.DB_PORT,     
});

export default pool;
