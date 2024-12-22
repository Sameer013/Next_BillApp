require('dotenv').config({path: '../.env'}); // Load environment variables
const mysql = require('mysql2/promise'); // Use promise-based MySQL for async/await

async function connectToDatabase() {
  try {
    // Create a connection pool
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: 3306,
    });

    console.log('Successfully connected to the database.');
    return connection; // Return the connection object for further use
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1); // Exit the process with failure
  }
}

// Test the connection
connectToDatabase();
