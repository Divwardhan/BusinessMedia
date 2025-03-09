import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();  

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",       
  host: "localhost",       
  database: "db1",   
  password: "",  
  port: 5433,     
});

export default pool;
