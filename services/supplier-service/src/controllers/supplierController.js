import axios from 'axios';
import { Op } from 'sequelize';
import Supplier from '../models/supplier.js';
import FormData from 'form-data';

const fileServiceUrl = process.env.FILE_SERVICE_URL || 'http://file-service:4005';

// ==================== GET ALL Suppliers ====================
export async function getAllSuppliers(req, res) {
  try {
    const suppliers = await Supplier.findAll();

    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }  
}

// ==================== GET Supplier ====================
export async function getSupplierById(req, res) {
  try {
    const { id } = req.params;

    // Fetch supplier by ID
    const supplier = await Supplier.findByPk(id);

    if (!supplier) {
      return res.status(404).json({ error: 'Fournisseur non trouvé.' });
    }

    res.json(supplier);

  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch supplier',
      details: err.message,
    });
  }
};

// ==================== CREATE Supplier ====================
export async function createSupplier(req, res) {
  try {
    const { id_fiscal, nom, n_tel } = req.body;
    const fileBuffer = req.file?.buffer;

    let file_id = null;

    if (fileBuffer) {
      // Prepare form-data using FormData
      const form = new FormData();
      form.append('file', fileBuffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        knownLength: req.file.size,
      });
      form.append('fileName', req.file.originalname);
      form.append('mimeType', req.file.mimetype);
      form.append('size', req.file.size);

      // Upload file to file-service
      const uploadRes = await axios.post(`${fileServiceUrl}/api/upload`, form, {
        headers: form.getHeaders(),
      });

      file_id = uploadRes.data.fileId;
    }

    const supplier = await Supplier.create({
      id_fiscal,
      nom,
      n_tel,
      file_id,
    });

    res.status(201).json(supplier);
  } catch (err) {
    console.error('Supplier creation failed:', err);
    res.status(500).json({ error: 'Failed to create supplier', details: err.message });
  }
};

// ==================== UPDATE Supplier ====================
export async function updateSupplier(req, res) {
  try {
    const { id } = req.params;

    // Récupération des champs à mettre à jour
    const { id_fiscal, nom, n_tel } = req.body;

    // Vérifie que le fournisseur existe
    const supplier = await Supplier.findByPk(id);
    if (!supplier){
      return res.status(404).json({ message: "Fournisseur non trouvé" });
    }

    // Vérifie si l'identifiant fiscal est utilisé par un autre fournisseur
    const existingSupplier = await Supplier.findOne({
      where: {
        [Op.and]: [
          { id_fiscal },
          { id: { [Op.ne]: id } }
        ]
      }
    });

    if (existingSupplier){
      return res.status(400).json({ message: "L’identifiant fiscal fourni est déjà associé à un autre fournisseur." })
    }

    // Mise à jour des champs
    await supplier.update({
      id_fiscal,
      nom,
      n_tel
    });

    res.status(200).json({ message: "Fournisseur mis à jour avec succès." })

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export async function deleteSupplier(req, res) {
  try {
    const { id } = req.params;

    const supplierToDelete = await Supplier.findByPk(id);

    if (supplierToDelete) {
      supplierToDelete.destroy();
      return res.status(200).json({ message: "Fournisseur supprimé avec succès." });
    } else {
      return res.status (404).json({ message: "Fichier non trouvé." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};