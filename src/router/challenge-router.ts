import { Router } from "express";
import * as challengeController from "../controller/challengeController";
import { body } from "express-validator";
import multer, { diskStorage } from 'multer'; 

export const config = {
    api: {
        bodyParser: false 
    }
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, './public/images'); //change this to the directory you want to store your files in
    },
    filename(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null,file.fieldname+ '-'+ uniqueSuffix +'.png')
    },
});
const upload = multer({storage:storage});


const router = Router();
const todoValidator = body("task").trim().notEmpty();

router.get("/event", challengeController.getAllChallenge);
router.patch("/:todoId",  challengeController.updateChallenge);
router.delete("/:todoId",challengeController.deleteChallenge);
router.post("/events", upload.single('image'), challengeController.addChallenge);


export default router;
