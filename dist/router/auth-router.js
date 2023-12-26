"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = __importStar(require("../controller/auth-controller"));
const express_validator_1 = require("express-validator");
const editProfile_1 = __importDefault(require("../controller/editProfile"));
const multer_1 = __importDefault(require("multer"));
const deleteUser_1 = __importDefault(require("../controller/deleteUser"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.put("/signup", [
    (0, express_validator_1.body)("fullname")
        .trim()
        .isLength({ min: 6 })
        .withMessage("too small fullname"),
    (0, express_validator_1.body)("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid Email")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 8 })
        .withMessage("Too small password"),
], authController.signupController);
router.post("/signin", [], authController.loginController);
router.put("/edit-profile/:userId", editProfile_1.default.editProfile);
router.get("/profile/:userId", editProfile_1.default.getProfile);
router.put("/update-profile-image/:userId", upload.single("profileImage"), editProfile_1.default.updateProfileImage);
router.get("/authentifier-profil", authController.authenticateProfile);
router.delete("/users/:userId", deleteUser_1.default.deleteUser);
exports.default = router;
