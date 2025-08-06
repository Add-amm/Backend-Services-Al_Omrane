export const validateSupplierInput = (req, res, next) => {
    const { id_fiscal, nom, n_tel } = req.body;
  
    if (!id_fiscal || !nom || !n_tel) {
      return res.status(400).json({
        error: 'Tous les champs sont obligatoires.',
        details: 'id_fiscal, nom, and n_tel are required.'
      });
    }
  
    next();
};