// backend/routes/authRoutes.js
const express = require("express");
const authController = require("../controllers/authController");
const { authMiddleware, logoutUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", logoutUser);
router.get("/protected-route", authMiddleware, (req, res) => {
  res
    .status(200)
    .send(`Welcome ${req.user.username}, this is a protected route!`);
});

module.exports = router;
