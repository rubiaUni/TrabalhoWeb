import { createNotebookService } from "../services/service.js";

export const createNotebook = async (req, res) => {
    try {

        const { brand, model } = req.body;

        if (!brand || !model) {
            return res.status(400).json({ error: 'Brand and model are required' });
        }

        const newNotebook = await createNotebookService(brand, model);

        res.status(201).json(newNotebook);

    } catch (error) {
        console.error('Error creating notebook:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 
