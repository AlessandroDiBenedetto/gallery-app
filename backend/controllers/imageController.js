const Image = require("../models/image");

const getImages = (req, res) => {
  // Recupera l'userId dal middleware di autenticazione
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).send({ error: "Unauthorized: User not logged in" });
  }

  Image.getAllByUserId(userId, (err, images) => {
    if (err) {
      return res.status(500).send({ error: "Error fetching images" });
    }
    res.status(200).send({ images });
  });
};

const deleteImage = (req, res) => {
  const userId = req.user?.userId;
  const imageId = req.params.id;

  if (!userId) {
    return res.status(401).send({ error: "Unauthorized: User not logged in" });
  }

  if (!imageId) {
    return res.status(400).send({ error: "Image ID is required" });
  }

  // Verifica che l'immagine appartenga all'utente
  Image.findById(imageId, (err, image) => {
    if (err) {
      return res.status(500).send({ error: "Error finding image" });
    }

    if (!image) {
      return res.status(404).send({ error: "Image not found" });
    }

    if (image.user_id !== userId) {
      return res.status(403).send({ error: "Forbidden: Cannot delete this image" });
    }

    // Elimina immagine
    Image.deleteById(imageId, (err) => {
      if (err) {
        return res.status(500).send({ error: "Error deleting image" });
      }

      res.status(200).send({ message: "Image deleted successfully" });
    });
  });
};


const uploadImage = (req, res) => {
  // Recupera l'userId dal middleware di autenticazione
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).send({ error: "Unauthorized: User not logged in" });
  }

  const { title, url } = req.body;

  Image.countByUserId(userId, (err, imageCount) => {
    if (err) {
      return res.status(500).send({ error: "Error checking image count" });
    }

    const maxImages = req.user.role === "premium" ? 10 : 3;

    if (imageCount >= maxImages) {
      return res.status(400).send({ error: "Image limit reached" });
    }

    const uploaded_at = new Date();

    Image.create(userId, title, url, (err) => {
      if (err) {
        return res.status(500).send({ error: "Error uploading image" });
      }
      res.status(201).send({
      message: "Image uploaded successfully",
      image: {
        title,
        url,
        uploaded_at
        },
      });
    });
  });
};

module.exports = { getImages, uploadImage, deleteImage};
