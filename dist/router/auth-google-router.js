"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthGoogle_1 = __importDefault(require("../controller/AuthGoogle"));
const router = express_1.default.Router();
router.get("/google", AuthGoogle_1.default.googleLogin);
router.get("/google/callback", AuthGoogle_1.default.googleCallback);
router.get("/profile", AuthGoogle_1.default.profile);
exports.default = router;
