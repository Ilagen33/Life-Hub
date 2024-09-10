import express from 'express';
import cloudinaryUploader from '../config/cloudinaryConfig.js'; // Multer configurato per Cloudinary

const router = express.Router();

// Carica documenti
router.post(
    '/upload', 
    cloudinaryUploader.single('document'), 
    (req, res, next) => {
      if (!req.file) {
        return res.status(400).json({ error: 'Nessun file caricato' });
      }
      res
        .status(200)
        .json({
          message: 'File caricato con successo',
          fileUrl: req.file.path, // URL del documento caricato
        });
    }
);

// Lista documenti
router.get(
    '/list', 
    async (req, res, next) => {
      try {
        // Esempio di richiesta a Cloudinary per ottenere la lista dei file
        const resources = await cloudinary
          .api
          .resources({ 
            type: 'upload', 
            prefix: 'documents/' 
          });

        res
          .status(200)
          .json(resources.resources);

  } catch (error) {
    next(error);
  }
});

export default router;
