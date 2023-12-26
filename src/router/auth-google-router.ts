import express from "express";
import AuthGoogle from "../controller/AuthGoogle";
import passport from "passport";

const router = express.Router();

router.get("/google", AuthGoogle.googleLogin);
router.get("/google/callback", AuthGoogle.googleCallback);
router.get("/profile", AuthGoogle.profile);

export default router;
