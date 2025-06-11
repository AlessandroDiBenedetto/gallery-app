// backend/models/user.js
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const User = {
  create: (username, email, password, role, callback) => {
    const sql =
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";

    db.query(sql, [username, email, password, role], (err, result) => {
      if (err) {
        console.error("Database error:", err); // Log dell'errore del database
        return callback(err);
      }
      callback(null, result);
    });
  },

  findByUsername: (username, callback) => {
    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], (err, results) => {
      if (err) {
        return callback(err);
      }
      console.log("Query results:", results); // Log dei risultati della query
      callback(null, results[0]); // Restituisci solo il primo risultato
    });
  },
};

module.exports = User;
