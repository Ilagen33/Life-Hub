import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinaryConfig.js'; // Usa la configurazione centralizzata di Cloudinary

// Configura lo storage per Multer usando Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // Non serve più `cloudinary.v2`
    params: async (req, file) => {
        let folder = "uploads"; // Cartella di default

        if (file.mimetype.startsWith("image/")) {
            folder = "images"; // Cartella per immagini
        } else if (file.mimetype === "application/pdf" || file.mimetype.startsWith("application/")) {
            folder = "documents"; // Cartella per documenti
        } else if (file.mimetype.startsWith("video/")) {
            folder = "videos"; // Cartella per video
        }

        let transformation = undefined;

        if (file.mimetype.startsWith("image/")) {
            transformation = [{ width: 500, height: 500, crop: "limit" }];
        }

        return {
            folder: folder, // Cartella dinamica
            allowed_formats: ["jpg", "png", "jpeg", "pdf", "doc", "docx", "xlsx", "mp4", "mov"], // Formati consentiti
            transformation, // Solo per le immagini
        };
    },
});

// Configura Multer con lo storage di Cloudinary
const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite di 10MB
});

export default upload;
