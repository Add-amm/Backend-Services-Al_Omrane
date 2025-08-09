import mime from 'mime-types';
import File from '../models/file.js';

export const uploadFile = async (req, res) => {
  try {
    const { originalname, mimetype, size, buffer } = req.file;

    const file = await File.create({
      fileName: originalname,
      mimeType: mimetype,
      size,
      file: buffer,
    });

    res.status(201).json({ fileId: file.id });
  } catch (err) {
    res.status(500).json({ error: 'File upload failed', details: err.message });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    let fileName = file.fileName;
    let ext;

    if (file.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      ext = 'docx';
    } else {
      ext = mime.extension(file.mimeType) || 'bin';
    }

    if (!fileName.includes('.') && ext) {
      fileName += `.${ext}`;
    }

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    if (file.mimeType) {
      res.setHeader('Content-Type', file.mimeType);
    }
    res.setHeader('Content-Length', file.size);

    res.send(Buffer.from(file.file));
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'File download failed', details: err.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const fileToDelete = await File.findByPk(id);

    if (fileToDelete) {
      fileToDelete.destroy();
      return res.status(200).json({ message: "fichier supprimé avec succès." })
    } else {
      return res.status(404).json({ message: "Fichier non trouvé."})
    }
  } catch (error) {
    res.status(200).json({ message: error.message })
  }
};