"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const forgotPassword_controller_1 = require("../controller/forgotPassword-controller");
const router = express_1.default.Router();
router.post("/send-email", forgotPassword_controller_1.forgotPassword);
router.post("/verify-reset-code", forgotPassword_controller_1.verifyResetCode);
router.post("/reset-password", forgotPassword_controller_1.resetPassword);
exports.default = router;
