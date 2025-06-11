// backend/routes/imageRoutes.js
const express = require("express");
const imageController = require("../controllers/imageController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/images", authMiddleware, imageController.getImages);
router.post("/images", authMiddleware, imageController.uploadImage);
router.delete("/images/:id", authMiddleware, imageController.deleteImage);

module.exports = router;
