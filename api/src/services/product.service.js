import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

class ProductNotFoundError extends Error {
  constructor(id) {
    super(`Produto com id "${id}" não encontrado.`);
    this.name = "ProductNotFoundError";
    this.statusCode = 404;
  }
}

class CategoryNotFoundError extends Error {
  constructor(categoryId) {
    super(`Categoria com id "${categoryId}" não encontrada.`);
    this.name = "CategoryNotFoundError";
    this.statusCode = 404;
  }
}

async function getAllProducts() {
  return prisma.product.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });
}

async function getProductById(id) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

async function createProduct(data) {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new CategoryNotFoundError(data.categoryId);
  }

  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      categoryId: data.categoryId,
    },
    include: { category: true },
  });
}

async function updateProduct(id, data) {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new ProductNotFoundError(id);
  }

  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new CategoryNotFoundError(data.categoryId);
  }

  try {
    return await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description ?? null,
        categoryId: data.categoryId,
      },
      include: { category: true },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new ProductNotFoundError(id);
    }
    throw error;
  }
}

async function deleteProduct(id) {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    throw new ProductNotFoundError(id);
  }

  try {
    return await prisma.product.delete({ where: { id } });
  } catch (error) {
    if (error.code === "P2025") {
      throw new ProductNotFoundError(id);
    }
    throw error;
  }
}

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  ProductNotFoundError,
  CategoryNotFoundError,
};