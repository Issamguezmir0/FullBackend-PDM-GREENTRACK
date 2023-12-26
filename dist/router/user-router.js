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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const controller = __importStar(require("../controller/user-controller"));
const path_1 = __importDefault(require("path"));
const ChangePassword_1 = require("../controller/ChangePassword");
// Multer storage configuration
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Specify the folder where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        // Use Date.now() to make sure that filenames are unique
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
const router = express_1.default.Router();
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
    .post(ChangePassword_1.changePassword);
router.get("/get-by-id/:id", controller.getById);
router.post("/validate-unique-email", controller.validateUniqueEmail);
exports.default = router;
