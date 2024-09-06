const budgetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    limit: { type: Number, required: true }, // Limite di budget per la categoria
    period: { type: String, enum: ['monthly', 'weekly'], default: 'monthly' },
  });
  
  const Budget = mongoose.model('Budget', budgetSchema);
  
  router.post('/budget', protect, async (req, res) => {
    const { category, limit } = req.body;
  
    const newBudget = new Budget({
      user: req.user._id,
      category,
      limit,
    });
  
    try {
      const savedBudget = await newBudget.save();
      res.status(201).json(savedBudget);
    } catch (error) {
      res.status(500).json({ error: 'Errore durante il salvataggio del budget.' });
    }
  });
  