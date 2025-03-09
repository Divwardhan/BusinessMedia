import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();  

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",       
  host: "localhost",       
  database: "newdb1",   
  password: String("k6pnog6g5y"),  
  port: 5433,     
});

export default pool;
