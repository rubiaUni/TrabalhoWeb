import { Router } from 'express';
import prisma from '../database/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { notebooks: true } } },
  });
  res.json(categories);
});

router.get('/:id', async (req, res) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(req.params.id) },
    include: { notebooks: true },
  });
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
});

router.post('/', async (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'Name is required' });
  const exists = await prisma.category.findUnique({ where: { name: req.body.name } });
  if (exists) return res.status(409).json({ error: 'Category name already exists' });
  const category = await prisma.category.create({ data: { name: req.body.name, description: req.body.description } });
  res.status(201).json(category);
});

router.put('/:id', async (req, res) => {
  const category = await prisma.category.findUnique({ where: { id: Number(req.params.id) } });
  if (!category) return res.status(404).json({ error: 'Category not found' });
  if (req.body.name) {
    const dup = await prisma.category.findUnique({ where: { name: req.body.name } });
    if (dup && dup.id !== Number(req.params.id)) return res.status(409).json({ error: 'Category name already exists' });
  }
  const updated = await prisma.category.update({
    where: { id: Number(req.params.id) },
    data: { name: req.body.name, description: req.body.description },
  });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const category = await prisma.category.findUnique({ where: { id: Number(req.params.id) } });
  if (!category) return res.status(404).json({ error: 'Category not found' });
  await prisma.category.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

export default router;
