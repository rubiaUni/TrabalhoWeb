// controllers/category.controller.js
const categoryService = require("../services/category.service");

async function getAllCategories(req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    return res.json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar categorias." });
  }
}

async function getCategoryById(req, res) {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }

    return res.json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar categoria." });
  }
}

async function createCategory(req, res) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "O campo 'name' é obrigatório." });
    }

    const category = await categoryService.createCategory({ name, description });
    return res.status(201).json(category);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "Erro ao criar categoria." });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "O campo 'name' é obrigatório." });
    }

    const category = await categoryService.updateCategory(id, { name, description });
    return res.json(category);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar categoria." });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    return res.status(204).send();
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "Erro ao excluir categoria." });
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};