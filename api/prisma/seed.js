import { PrismaClient } from '../src/generated/prisma/index.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function seed() {
  const count = await prisma.notebook.count();
  if (count > 0) {
    console.log('Database already seeded, skipping');
    await prisma.$disconnect();
    return;
  }

  const cats = await Promise.all([
    prisma.category.create({ data: { name: 'Gaming', description: 'Notebooks para jogos' } }),
    prisma.category.create({ data: { name: 'Office', description: 'Escritório e estudos' } }),
    prisma.category.create({ data: { name: 'Workstation', description: 'Trabalho pesado' } }),
  ]);

  await prisma.notebook.create({
    data: {
      brand: 'Dell', model: 'Inspiron 15 3000', categoryId: cats[1].id,
      cpuBrand: 'Intel', cpuModel: 'Core i5-1235U', cpuCores: 10, cpuThreads: 12,
      ramGb: 8, ramType: 'DDR4', storageGb: 256, storageType: 'SSD',
      displaySize: 15.6, displayPanel: 'IPS',
      osName: 'Windows 11',
    },
  });

  await prisma.notebook.create({
    data: {
      brand: 'Lenovo', model: 'ThinkPad X1 Carbon', categoryId: cats[2].id,
      cpuBrand: 'Intel', cpuModel: 'Core i7-1365U', cpuCores: 10, cpuThreads: 12,
      ramGb: 16, ramType: 'LPDDR5', storageGb: 512, storageType: 'NVMe',
      displaySize: 14, displayPanel: 'IPS',
      osName: 'Windows 11 Pro',
    },
  });

  await prisma.notebook.create({
    data: {
      brand: 'ASUS', model: 'ROG Zephyrus G14', categoryId: cats[0].id,
      cpuBrand: 'AMD', cpuModel: 'Ryzen 9 7940HS', cpuCores: 8, cpuThreads: 16,
      ramGb: 32, ramType: 'DDR5', storageGb: 1024, storageType: 'NVMe',
      gpuModel: 'RTX 4060', gpuVramGb: 8,
      displaySize: 14, displayPanel: 'OLED',
      osName: 'Windows 11',
    },
  });

  await prisma.$disconnect();
  console.log('Seed completed');
}

seed().catch(e => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});
