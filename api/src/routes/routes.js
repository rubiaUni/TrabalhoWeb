import { Router } from 'express';
import prisma from '../database/prisma.js';

const router = Router();

const NOTEBOOK_FIELDS = [
  'brand', 'model', 'categoryId',
  'cpuBrand', 'cpuModel', 'cpuCores', 'cpuThreads',
  'ramGb', 'ramType', 'storageGb', 'storageType',
  'gpuModel', 'gpuVramGb', 'gpuDedicated',
  'displaySize', 'displayRes', 'displayPanel',
  'osName', 'osLicense',
  'batteryMWh', 'batteryHealth',
  'conditionDesc', 'coverageMonths',
];

function pick(body, fields) {
  return Object.fromEntries(fields.filter(k => k in body).map(k => [k, body[k]]));
}

router.get('/', async (req, res) => {
  const notebooks = await prisma.notebook.findMany({
    include: { category: true, images: true },
  });
  res.json(notebooks);
});

router.get('/:id', async (req, res) => {
  const notebook = await prisma.notebook.findUnique({
    where: { id: Number(req.params.id) },
    include: { category: true, images: true },
  });
  if (!notebook) return res.status(404).json({ error: 'Notebook not found' });
  res.json(notebook);
});

router.post('/', async (req, res) => {
  const { brand, model } = req.body;
  if (!brand || !model) return res.status(400).json({ error: 'Brand and model are required' });
  try {
    const notebook = await prisma.notebook.create({ data: pick(req.body, NOTEBOOK_FIELDS) });
    res.status(201).json(notebook);
  } catch {
    res.status(500).json({ error: 'Error creating notebook' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const notebook = await prisma.notebook.update({
      where: { id: Number(req.params.id) },
      data: pick(req.body, NOTEBOOK_FIELDS),
    });
    res.json(notebook);
  } catch (err) {
    if (err?.code === 'P2025') return res.status(404).json({ error: 'Notebook not found' });
    res.status(500).json({ error: 'Error updating notebook' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.notebook.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    if (err?.code === 'P2025') return res.status(404).json({ error: 'Notebook not found' });
    res.status(500).json({ error: 'Error deleting notebook' });
  }
});

export default router;
