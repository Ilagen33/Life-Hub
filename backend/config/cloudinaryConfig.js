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

// Configurazione dello storage Cloudinary con gestione delle cartelle
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "uploads"; // Cartella di default

    // Se il file è un'immagine
    if (file.mimetype.startsWith("image/")) {
      folder = "images"; // Cartella per immagini
    }
    
    // Se il file è un documento (es. PDF, Word, Excel)
    if (file.mimetype === "application/pdf" || file.mimetype === "application/msword" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      folder = "documents"; // Cartella per documenti
    }

    // Se il file è un video
    if (file.mimetype.startsWith("video/")) {
      folder = "videos"; // Cartella per video
    }

    let transformation = undefined;

    // Applica una trasformazione solo alle immagini
    if (file.mimetype.startsWith("image/")) {
      transformation = [{ width: 500, height: 500, crop: "limit" }];
    }

    return {
      folder: folder, // Assegna la cartella dinamicamente
      allowed_formats: ["jpg", "png", "jpeg", "gif", "pdf", "doc", "docx", "xlsx", "mp4", "mov"], // Formati consentiti
      transformation, // Solo per le immagini
    };
  },
});

// Creazione dell'uploader Multer con lo storage Cloudinary configurato
const cloudinaryUploader = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite di 5MB
});

// Route per il caricamento del file su Cloudinary
router.post('/upload', cloudinaryUploader.single('media'), (req, res) => {
    // Restituisci l'URL del file caricato (Cloudinary restituisce il link nel path)
    if (!req.file) {
        return res.status(400).json({ message: 'Errore: Nessun file caricato!' });
      }
      res.status(200).json({ filePath: req.file.path });  });

// Esportazione dell'uploader per l'uso in altre parti dell'applicazione
export default cloudinaryUploader;