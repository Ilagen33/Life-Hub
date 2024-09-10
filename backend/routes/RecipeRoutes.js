import express from 'express';
import Recipe from '../models/Recipe.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Middleware di autenticazione

const router = express.Router();

// Rotta per aggiungere una nuova ricetta
router.post(
  '/Recipe', 
  [
    body("name")
      .notEmpty()
      .withMessage("Il nome della ricetta è obbligatorio." )
      .isLength({ min: 3 })
      .withMessage("Il nome della ricetta deve essere lungo almeno 3 caratteri.")
      .isLength({ max: 100 })
      .withMessage("Il nome della ricetta non può superare i 100 caratteri.")
      .isString()
      .withMessage("Il nome della ricetta deve essere una stringa.")
      .trim(),

    body("description")
      .notEmpty()
      .withMessage("La descrizione della ricetta è obbligatoria.")
      .isLength({ min: 10 })
      .withMessage("La descrizione della ricetta deve essere lunga almeno 10 caratteri.")
      .isLength({ max: 500 })
      .withMessage("La descrizione della ricetta non può superare i 500 caratteri.")
      .isString()
      .withMessage("La descrizione della ricetta deve essere una stringa.")
      .trim(),

    body("image")
      .optional()
      .isURL()
      .withMessage("L'URL dell'immagine deve essere una URL valida.")
      .trim(),

    body("preparationTime")
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage("Il tempo di preparazione deve essere un numero intero positivo.")
      .trim(),

    body("cookingTime")
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage("Il tempo di cottura deve essere un numero intero positivo.")
      .trim(),

    body("difficulty")
      .optional()
      .isIn(['Facile', 'Medio', 'Difficile'])
      .withMessage("La difficoltà deve essere 'Facile', 'Medio' o 'Difficile'.")
      .trim(),

    body("portate")
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage("Il numero di portate deve essere un numero intero positivo.")
      .trim(),

    body("calories")
      .optional()
      .isInt({ min: 1, max: 10000 })
      .withMessage("Il numero di calorie deve essere un numero intero positivo.")
      .trim(),

    body("ingredients")
      .isArray({ min: 1 })
      .withMessage("Gli ingredienti devono essere un array di stringhe."),

    body("steps")
      .isArray({ min: 1 })
      .withMessage("Le istruzioni devono essere un array di stringhe."),

    body("notes")
      .optional()
      .isString()
      .withMessage("Le note devono essere una stringa."),

    body("category")
      .notEmpty()
      .withMessage("La categoria è obbligatoria.")
      .isString()
      .withMessage("La categoria deve essere una stringa.")
      .trim()
      .isIn(['Breakfast', 'Lunch', 'Dinner', 'Snack'])

  ],
  authMiddleware, 
  async (req, res, next) => {
    // Verifica se ci sono errori di validazione
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ 
          errors: errors.array() 
        });
    }
    next();
  
    try {
      const newRecipe = new Recipe({
        user: req.user._id,
        ...req.body,
      });

      const savedRecipe = await newRecipe.save();

      res
        .status(201)
        .json({
          savedRecipe,
          message: "Ricetta aggiunta con successo."
        });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// Rotta per ottenere tutte le ricette
router.get(
  '/Recipe', 
  authMiddleware, 
  async (req, res, next) => {
    try {
      //PAGINAZIONE
      const page = parseInt(req.query.page) || 1;
      const limite = parseInt(req.query.limit) || 10;
      const ordinamento = req.query.sort || "dueDate";
      const direzOrdine = req.query.sortDirection === "desc" ? -1 : 1;
      const salta = (page - 1) * limite; //per visualizzare ulteriori elementi alla pagina successiva salto il numero di elementi presenti nella pagina precedente
  
      // FILTRI
      const filter = {};
      if (req.query.name) {
          filter.name = req.query.name; // Filtra per name (ad es., "completed", "pending")
      }
      if (req.query.preparationTime) {
          filter.preparationTime = req.query.preparationTime; // Filtra per categoria (ad es., "work", "personal")
      }
      if (req.query.cookingTime) {
          filter.cookingTime = new Date(req.query.cookingTime); // Filtra per data di scadenza
      }
      if (req.query.difficulty) {
        filter.difficulty = new Date(req.query.difficulty); // Filtra per data di scadenza
      }
      if (req.query.steps) {
        filter.steps = new Date(req.query.steps); // Filtra per data di scadenza
      }
      if (req.query.category) {
        filter.category = new Date(req.query.category); // Filtra per data di scadenza
      }
      if (req.query.calories) {
        filter.calories = new Date(req.query.calories); // Filtra per data di scadenza
      }
      // QUERY AL DATABASE CON FILTRI, ORDINAMENTO E PAGINAZIONE
      //Nella query al database sono integrati: filtri, ordinamento e paginazione
      const recipes = await Recipe.find({
          user: req.user._id, 
          ...filter
      })
          .sort({ [ordinamento]: direzOrdine })
          .skip(salta)
          .limit(limite);

      const totale = await Recipe.countDocuments({user: req.user._id});

      res
        .status(200)
        .json({
          recipes: recipes,
          currentPage: page,
          totalPages: Math.ceil(totale / limite),
          totalItems: totale,
          message: "Ricette ottenute con successo."
        });

    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
