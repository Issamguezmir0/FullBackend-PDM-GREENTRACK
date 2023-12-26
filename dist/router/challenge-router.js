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
exports.config = void 0;
const express_1 = require("express");
const challengeController = __importStar(require("../controller/challengeController"));
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
exports.config = {
    api: {
        bodyParser: false
    }
};
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images'); //change this to the directory you want to store your files in
    },
    filename(req, file, callback) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.fieldname + '-' + uniqueSuffix + '.png');
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const router = (0, express_1.Router)();
const todoValidator = (0, express_validator_1.body)("task").trim().notEmpty();
router.get("/event", challengeController.getAllChallenge);
router.patch("/:todoId", challengeController.updateChallenge);
router.delete("/:todoId", challengeController.deleteChallenge);
router.post("/events", upload.single('image'), challengeController.addChallenge);
exports.default = router;
