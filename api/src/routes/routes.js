import { Router } from "express";
import { 
    createNotebook,
    getAllNotebooks,
    getNotebookById,
    updateNotebook,
    deleteNotebook
} from "../controllers/controller.js";

const router = Router();

router.get('/', getAllNotebooks);
router.post('/', createNotebook);
router.get('/:id', getNotebookById);
router.put('/:id', updateNotebook);
router.delete('/:id', deleteNotebook);

export default router;