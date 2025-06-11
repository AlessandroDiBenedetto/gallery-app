// backend/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.registerUser = (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  User.create(username, email, hashedPassword, "standard", (err, result) => {
    if (err) {
      console.error("Error registering user:", err); // Log dell'errore
      return res.status(500).send({ error: "Error registering user" });
    }
    res.status(201).send({ message: "User registered successfully" });
  });
};

exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  // Verifica se username e password sono forniti
  if (!username || !password) {
    return res
      .status(400)
      .send({ error: "Username and password are required" });
  }

  // Trova l'utente per nome utente
  User.findByUsername(username, (err, user) => {
    if (err) {
      console.error("Error during login:", err); // Log dell'errore
      return res.status(500).send({ error: "An error occurred during login" });
    }

    if (!user) {
      return res.status(400).send({ error: "Invalid credentials" });
    }

    // Controlla se la password è corretta
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send({ error: "Invalid credentials" });
    }

    // Crea un token JWT
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const options = {
      expiresIn: "1h", // Il token scade in 1 ora
      jwtid: `${user.id}-${Date.now()}`, // Identificativo univoco per il token (campo `jti`)
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, options);

    // Invia il token come risposta
    res.status(200).send({
      message: "Login successful",
      token,
    });
  });
};
