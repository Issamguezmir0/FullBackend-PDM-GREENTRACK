import express, {Router, Request, Response} from "express";
import multer from "multer";
import * as controller from "../controller/user-controller";
import path from "path";
import {changePassword} from "../controller/ChangePassword";

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Specify the folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        // Use Date.now() to make sure that filenames are unique
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({storage});

const router: Router = express.Router();

// PATH = /user

// BASE ROUTING
router.route("/")
    .get(controller.getAll)
    .put(upload.single("image"), controller.update);

router.route("/:id")
    .put(upload.single("image"), controller.update);

router.route("/:id")
    .delete(controller.deleteUser);

router.route("/change-password")
    .post(changePassword);

router.get("/get-by-id/:id", controller.getById);

router.post("/validate-unique-email", controller.validateUniqueEmail);

export default router;
