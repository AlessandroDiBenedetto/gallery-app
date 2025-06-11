// backend/models/image.js
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

class Image {
  static create(userId, title, url, callback) {
    const query = "INSERT INTO images (user_id, title, url) VALUES (?, ?, ?)";
    db.query(query, [userId, title, url], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  }

static getAllByUserId(userId, callback) {
  const query = "SELECT * FROM images WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    console.log("DB results:", results);  // <-- log
    callback(null, results);
  });
}


    static findById(id, callback) {
    const query = "SELECT * FROM images WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback(null, null); // immagine non trovata
      }
      callback(null, results[0]);
    });
  }

  static deleteById(id, callback) {
    const query = "DELETE FROM images WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  }


  static countByUserId(userId, callback) {
    const query = "SELECT COUNT(*) AS imageCount FROM images WHERE user_id = ?";
    db.query(query, [userId], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0].imageCount);
    });
  }
}

module.exports = Image;
