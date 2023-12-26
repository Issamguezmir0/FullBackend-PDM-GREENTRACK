import { Router } from "express";
import * as homeController from "../controller/home-controller";
import { body } from "express-validator";

const router = Router();
const homeValidator = body("task").trim().notEmpty();

router.get("/homes", homeController.getAllHomes);
router.post("/home", homeController.addHome);
router.patch("/:homeId", homeController.updateHome);
router.delete("/:homeId", homeController.deleteHome);

router.post("/:homeId/comment", homeController.addComment);
router.get("/:homeId/comments", homeController.getComments);
router.post("/:homeId/like", homeController.addLike);

export default router;
