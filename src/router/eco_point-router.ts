import { Router } from "express";
import * as eco_pointController from "../controller/eco_point-controller";
import { body } from "express-validator";

const router = Router();
const todoValidator = body("task").trim().notEmpty();

router.get("/eco_points", eco_pointController.getAllEco_points);
router.post("/eco_point", eco_pointController.addEco_point);
router.patch(
  "/:eco_pointId",
  todoValidator,
  eco_pointController.updateEco_point
);
router.delete("/:eco_pointId", eco_pointController.deleteEco_point);

export default router;
