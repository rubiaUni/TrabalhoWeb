import prisma from '../database/prisma.js';

export const getAllNotebooksService = async () => {
    return await prisma.notebook.findMany();
};

export const createNotebookService = async (brand, model) => {
    const newNotebook = await prisma.notebook.create({
        data: {
            brand,
            line,
            model,
            processor,
            threads,
            ram,
            maxcap,
            storage,
            graphicCard,
            display,
            operationalSystem,
            price
        },
    });

    return newNotebook;
}

export const getNotebookByIdService = async (id) => {
    return await prisma.notebook.findUnique({
        where: {
            id: Number(id)
        },
    });
};

export const updateNotebookService = async (id, data) => {
    return await prisma.notebook.update({
        where: {
            id: Number(id)
        },
        data,
    });
};

export const deleteNotebookService = async (id) => {
    return await prisma.notebook.delete({
        where: {
            id: Number(id),
        },
    });
};