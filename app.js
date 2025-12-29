require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");

const app = express();

/**
 * MySQL Connection Pool
 */
const db = mysql.createPool({
  host: process.env.DB_HOST,     // RDS endpoint
  user: process.env.DB_USER,     // admin
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // users_db
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10
});

/**
 * Test DB connection
 */
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL RDS");
    connection.release();
  }
});

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.send("User Read-Only App is running");
});

/**
 * READ: Get all users
 */
app.get("/users", (req, res) => {
  db.query(
    "SELECT id, username, email, created_at FROM users",
    (err, results) => {
      if (err) {
        console.error("Error fetching users:", err.message);
        return res.status(500).json({ error: "Failed to fetch users" });
      }
      res.json(results);
    }
  );
});

/**
 * Server start
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
