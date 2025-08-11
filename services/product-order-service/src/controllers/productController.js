import { Product } from '../models/relations.js';

// ==================== GET All Products ====================
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==================== GET Product by ID ====================
export const getProductById = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
  
      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }
  
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// ==================== CREATE Product ====================
export const createProduct = async (req, res) => {
    try {
      const {
        type,
        nom,
        description,
        dateAchat,
        prix,
        stock,
        id_fournisseur
      } = req.body;
  
      const newProduct = await Product.create({
        type,
        nom,
        description,
        dateAchat,
        prix,
        stock,
        id_fournisseur
      });
  
      res.status(201).json(newProduct);
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// ==================== UPDATE Product ====================
export const updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      const {
        type,
        nom,
        description,
        dateAchat,
        prix,
        stock,
        id_fournisseur
      } = req.body;
  
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }
  
      await product.update({
        type,
        nom,
        description,
        dateAchat,
        prix,
        stock,
        id_fournisseur
      });
  
      res.json({ message: 'Produit mis à jour avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// ==================== DELETE Product ====================
export const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }
  
      await product.destroy();
  
      res.json({ message: 'Produit supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};