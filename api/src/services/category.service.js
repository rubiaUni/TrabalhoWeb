const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

class CategoryNameAlreadyExistsError extends Error {
  constructor(name) {
    super(`Já existe uma categoria com o nome "${name}".`);
    this.name = "CategoryNameAlreadyExistsError";
    this.statusCode = 409;
  }
}

class CategoryNotFoundError extends Error {
  constructor(id) {
    super(`Categoria com id "${id}" não encontrada.`);
    this.name = "CategoryNotFoundError";
    this.statusCode = 404;
  }
}

class CategoryHasProductsError extends Error {
  constructor(count) {
    super(`Não é possível excluir esta categoria: existem ${count} produto(s) vinculado(s) a ela.`);
    this.name = "CategoryHasProductsError";
    this.statusCode = 409;
  }
}

async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

async function getCategoryById(id) {
  return prisma.category.findUnique({
    where: { id },
    include: { products: true },
  });
}

async function createCategory(data) {
  const existing = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new CategoryNameAlreadyExistsError(data.name);
  }

  return prisma.category.create({
    data: {
      name: data.name,
      description: data.description ?? null,
    },
  });
}

async function updateCategory(id, data) {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new CategoryNotFoundError(id);
  }

  const duplicate = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (duplicate && duplicate.id !== id) {
    throw new CategoryNameAlreadyExistsError(data.name);
  }

  try {
    return await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new CategoryNameAlreadyExistsError(data.name);
    }
    if (error.code === "P2025") {
      throw new CategoryNotFoundError(id);
    }
    throw error;
  }
}

async function deleteCategory(id) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    throw new CategoryNotFoundError(id);
  }

  if (category._count.products > 0) {
    throw new CategoryHasProductsError(category._count.products);
  }

  return prisma.category.delete({
    where: { id },
  });
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryNameAlreadyExistsError,
  CategoryNotFoundError,
  CategoryHasProductsError,
};