import { Router } from "express";
import * as authController from "../controller/auth-controller";
import { body } from "express-validator";
import editProfile from "../controller/editProfile";
import multer from "multer";
import deleteUser from "../controller/deleteUser";
const router = Router();
const upload = multer();

router.put(
  "/signup",
  [
    body("fullname")
      .trim()
      .isLength({ min: 6 })
      .withMessage("too small fullname"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid Email")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Too small password"),
  ],
  authController.signupController
);

router.post("/signin", [], authController.loginController);
router.put("/edit-profile/:userId", editProfile.editProfile);
router.get("/profile/:userId", editProfile.getProfile);
router.put(
  "/update-profile-image/:userId",
  upload.single("profileImage"),
  editProfile.updateProfileImage
);
router.get("/authentifier-profil", authController.authenticateProfile);
router.delete("/users/:userId", deleteUser.deleteUser);

export default router;
