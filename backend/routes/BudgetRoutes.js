router.get('/', protect, async (req, res) => {
    const { startDate, endDate, category } = req.query;
    
    const filters = { user: req.user._id };
    if (startDate && endDate) {
      filters.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (category) {
      filters.category = category;
    }
  
    try {
      const finances = await Finance.find(filters);
      res.status(200).json(finances);
    } catch (error) {
      res.status(500).json({ error: 'Errore durante il recupero delle transazioni.' });
    }
  });
  