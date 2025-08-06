import axios from 'axios';
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