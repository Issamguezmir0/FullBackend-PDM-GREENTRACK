"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateProfile = exports.loginController = exports.signupController = void 0;
const express_validator_1 = require("express-validator");
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
//import dotenv from "dotenv";
const signupController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Request body:", req.body);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessage = errors.array()[0].msg;
        console.error(errors);
        return res.status(400).json({ message: errorMessage });
    }
    const { fullname, email, password, adresse, cin, num_tel } = req.body;
    console.log("Data before creating user:");
    console.log("fullname:", fullname);
    console.log("adresse:", adresse);
    console.log("email:", email);
    console.log("cin:", cin);
    console.log("num_tel:", num_tel);
    const existingUser = yield user_1.default.getUser(email);
    if (existingUser !== user_1.default.empty) {
        return res.status(400).json({ message: "This email is already used" });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 12);
    const img = "example.jpg";
    const age = "11";
    const newUser = new user_1.default(fullname, adresse, email, cin, num_tel, hashedPassword, img, age, false);
    console.log("Data after creating user:");
    console.log("newUser:", newUser);
    const userId = yield newUser.createUser();
    const token = jsonwebtoken_1.default.sign({ email: email, userId: userId }, "mySecretKey", {
        expiresIn: "1h",
    });
    res.status(200).json({ token: token, userId: userId });
});
exports.signupController = signupController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorMessage = errors.array()[0].msg;
            return res.status(400).json({ message: errorMessage });
        }
        const { email, password } = req.body;
        const user = yield user_1.default.getUser(email);
        if (user === user_1.default.empty) {
            return res
                .status(400)
                .json({ message: "No user found with this email, please sign up!" });
        }
        const isEqual = yield bcrypt_1.default.compare(password, user.password);
        if (!isEqual) {
            return res
                .status(400)
                .json({ message: "Wrong password, enter correct one." });
        }
        const token = jsonwebtoken_1.default.sign({ user }, "mySecretKey", { expiresIn: "1h" });
        res.status(200).json({ token: token, userId: user.id, user: user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.loginController = loginController;
//dotenv.config();
const authenticateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Non autorisé - Token manquant" });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, "mySecretKey");
            console.log("Decoded Payload:", decoded);
            return res.json(decoded);
        }
        catch (error) {
            console.error("Token verification failed:", error);
        }
    }
    catch (error) {
        console.error("Erreur lors de l'authentification du profil :", error.message);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: error.message });
        }
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
});
exports.authenticateProfile = authenticateProfile;
