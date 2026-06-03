import prisma from '../database/prisma.js';

export const createNotebookService = async (brand, model) => {
    const newNotebook = await prisma.notebook.create({
        data: {
            brand,
            model,
        },
    });

    return newNotebook;
}