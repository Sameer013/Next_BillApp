require('dotenv').config(); // Load environment variables
const mysql = require('mysql2/promise'); // Use promise-based MySQL for async/await

console.log(process.env.DB_HOST);
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);



async function connectToDatabase() {
  try {
    
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 3306,
    });

    console.log('Successfully connected to the database.');
    return db; // Return the connection object for further use
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    // process.exit(1); // Exit the process with failure
  }
}

// Test the connection
module.exports=connectToDatabase();
