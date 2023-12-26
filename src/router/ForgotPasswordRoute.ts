import express from "express";
import {forgotPassword, verifyResetCode, resetPassword} from "../controller/forgotPassword-controller";

const router = express.Router();

router.post("/send-email", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);

export default router;
