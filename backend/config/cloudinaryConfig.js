// Importazione delle dipendenze necessarie
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import "dotenv/config";
import express from "express";
const router = express.Router();

// Configurazione di Cloudinary con le credenziali dall'ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configurazione dello storage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // Specifica la cartella di destinazione su Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "gif"], // Limita i formati di file accettati
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Ridimensiona e limita la grandezza
  },
});

// Creazione dell'uploader Multer con lo storage Cloudinary configurato
const cloudinaryUploader = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite di 5MB
});

// Volendo, si poteva pure inserire un limite alla dimensione dei file caricabili, ad esempio:
// const cloudinaryUploader = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 } // Limite di 5MB
// });
// Route per il caricamento del file su Cloudinary
router.post('/upload', cloudinaryUploader.single('media'), (req, res) => {
    // Restituisci l'URL del file caricato (Cloudinary restituisce il link nel path)
    if (!req.file) {
        return res.status(400).json({ message: 'Errore: Nessun file caricato!' });
      }
      res.status(200).json({ filePath: req.file.path });  });

// Esportazione dell'uploader per l'uso in altre parti dell'applicazione
export default cloudinaryUploader;