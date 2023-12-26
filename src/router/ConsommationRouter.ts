import { Router } from "express";
import * as ConsommationController from "../controller/ConsommationController";
import { body } from "express-validator";

const router = Router();

router.post("/add", ConsommationController.addC);
router.get("/total", ConsommationController.CalculTotal);
router.post("/totalType", ConsommationController.CalculTotalByType);

export default router;
