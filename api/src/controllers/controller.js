import {
    createNotebookService,
    getAllNotebooksService,
    getNotebookByIdService,
    updateNotebookService,
    deleteNotebookService
} from "../services/service.js";

export const getAllNotebooks = async (req, res) => {
    try {
        const notebooks = await getAllNotebooksService();
        res.status(200).json(notebooks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notebooks' })
    }
}

export const createNotebook = async (req, res) => {
    try {
        const { brand, model } = req.body;
        if (!brand || !model) {
            return res.status(400).json({ error: 'Brand and model are required' });
        }
        const newNotebook = await createNotebookService(brand, model, processor, threads, ram, maxcap, storage, graphicCard, display, operationalSystem, price);
        res.status(201).json(newNotebook);
    } catch (error) {
        res.status(500).json({ error: 'Error creating notebook' });
    }
};

export const getNotebookById = async (req, res) => {
    try {
        const { id } = req.params;
        const notebook = await getNotebookByIdService(id);
        if (!notebook) {
            return res.status(404).json({ error: 'Notebook not found' });
        }
        res.status(200).json(notebook);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notebook' });
    }
}

export const updateNotebook = async (req, res) => {
    try {
        const { id } = req.params;
        const { brand, model } = req.body;

        const updatedNotebook = await updateNotebookService(id, { brand, model });
        res.status(200).json(updatedNotebook);
    } catch (error) {
        res.status(500).json({ error: 'Error updating notebook! Notebook not founded' });
    }
}

export const deleteNotebook = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNotebook = await deleteNotebookService(id);
        res.status(200).json(deletedNotebook);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting notebook! Notebook not founded' });
    }
}