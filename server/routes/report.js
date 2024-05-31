import express from "express";
const router = express.Router();
import { addReport } from "../controllers/reportController.js";

router.patch("/:id/addReport", addReport);
export default router;
