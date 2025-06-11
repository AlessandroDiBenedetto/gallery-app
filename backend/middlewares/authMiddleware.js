const jwt = require("jsonwebtoken");
const db = require("../db");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send({ error: "Access Denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    db.query(
      "SELECT * FROM token_blacklist WHERE token_id = ?",
      [decoded.jti],
      (err, results) => {
        if (err) {
          return res.status(500).send({ error: "Database error" });
        }

        if (results.length > 0) {
          return res.status(401).send({ error: "Token has been invalidated" });
        }

        req.user = decoded;
        next();
      }
    );
  } catch (error) {
    console.error("erroer", error);
    res.status(401).send({ error: "Invalid or expired token" });
  }
};

const logoutUser = (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ error: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded.jti) {
      return res
        .status(400)
        .send({ error: "Invalid token format: missing jti" });
    }

    const tokenId = decoded.jti;

    db.query(
      "INSERT INTO token_blacklist (token_id) VALUES (?)",
      [tokenId],
      (err) => {
        if (err) {
          console.error("Database error during logout:", err);
          return res.status(500).send({ error: "Error processing logout" });
        }

        res.status(200).send({ message: "Logout successful" });
      }
    );
  } catch (error) {
    console.error("Error verifying token during logout:", error);
    return res.status(401).send({ error: "Invalid or expired token" });
  }
};

module.exports = { authMiddleware, logoutUser };
