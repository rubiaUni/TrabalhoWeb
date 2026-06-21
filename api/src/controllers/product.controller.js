import * as productService from "../services/product.service.js";

async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar produtos." });
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar produto." });
  }
}

async function createProduct(req, res) {
  try {
    const { name, description, categoryId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "O campo 'name' é obrigatório." });
    }

    if (!categoryId) {
      return res.status(400).json({ message: "O campo 'categoryId' é obrigatório." });
    }

    const product = await productService.createProduct({ name, description, categoryId });
    return res.status(201).json(product);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "Erro ao criar produto." });
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, categoryId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "O campo 'name' é obrigatório." });
    }

    if (!categoryId) {
      return res.status(400).json({ message: "O campo 'categoryId' é obrigatório." });
    }

    const product = await productService.updateProduct(id, { name, description, categoryId });
    return res.json(product);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar produto." });
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    return res.status(204).send();
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "Erro ao excluir produto." });
  }
}

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};