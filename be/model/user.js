import pool from '../db/database_connection.js'

async function createUsers(){
    try{
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `;

        await pool.query(query)
        console.log("Table is done for the profile")
    }catch(err){
        console.log('Table for the users has an error ',err)
    }
}

createUsers()