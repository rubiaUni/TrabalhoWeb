import { Router } from 'express';
import multer from 'multer';
import { unlink } from 'fs/promises';
import { join } from 'path';
import prisma from '../database/prisma.js';

const UPLOADS_DIR = '/data/uploads';

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Apenas imagens são permitidas'));
    cb(null, true);
  },
});

const router = Router();

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });
  const notebookId = Number(req.body.notebookId);
  if (!notebookId) return res.status(400).json({ error: 'notebookId é obrigatório' });

  try {
    const notebook = await prisma.notebook.findUnique({ where: { id: notebookId } });
    if (!notebook) return res.status(404).json({ error: 'Notebook não encontrado' });

    const image = await prisma.notebookImage.create({
      data: {
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        notebookId,
      },
    });
    res.status(201).json(image);
  } catch {
    res.status(500).json({ error: 'Erro ao salvar imagem' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const image = await prisma.notebookImage.findUnique({ where: { id: Number(req.params.id) } });
    if (!image) return res.status(404).json({ error: 'Imagem não encontrada' });
    await unlink(join(UPLOADS_DIR, image.filename)).catch(() => {});
    await prisma.notebookImage.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch {
    res.status(500).json({ error: 'Erro ao deletar imagem' });
  }
});

export default router;
