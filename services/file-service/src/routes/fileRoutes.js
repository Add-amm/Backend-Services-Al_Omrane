import { Router } from 'express';
import upload from '../middlewares/multerMiddleware.js';
import { uploadFile, downloadFile } from '../controllers/fileController.js';

const router = Router();

router.post('/upload', upload.single('contrat'), uploadFile);

router.get('/download/:id', downloadFile);

export default router;