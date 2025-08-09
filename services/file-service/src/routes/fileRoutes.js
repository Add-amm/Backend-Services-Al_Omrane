import { Router } from 'express';
import upload from '../middlewares/multerMiddleware.js';
import { uploadFile, downloadFile, deleteFile } from '../controllers/fileController.js';

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);

router.get('/download/:id', downloadFile);

router.delete('/delete/:id', deleteFile);

export default router;