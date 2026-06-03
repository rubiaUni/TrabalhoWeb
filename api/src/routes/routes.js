import { Router } from "express";
import { createNotebook } from "../controllers/controller.js";

const router = Router();

router.post('/', createNotebook);

export default router;