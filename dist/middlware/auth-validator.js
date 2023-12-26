"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authValidator = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (authHeader === undefined) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, "mySecretKey");
        if (decodedToken === null) {
            res.status(401).json({ message: " Not authenticated" });
            return;
        }
        res.locals.userId = decodedToken.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ message: " Not authenticated" });
    }
};
exports.default = authValidator;
