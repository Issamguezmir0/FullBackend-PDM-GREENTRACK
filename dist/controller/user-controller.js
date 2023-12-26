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
exports.validateUniqueEmail = exports.deleteUser = exports.update = exports.getById = exports.getAll = void 0;
const user_1 = __importDefault(require("../models/user"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.getAll();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getAll = getAll;
const getById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.getById(req.params.id);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getById = getById;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body, file } = req;
        const fullname = body.fullname.replace(/"/g, '');
        const email = body.email.replace(/"/g, '');
        const num_tel = body.num_tel.replace(/"/g, '');
        yield user_1.default.update(req.params.id, Object.assign(Object.assign({}, body), { img: file ? file.filename : null, fullname,
            email,
            num_tel }));
        res.status(200).json({});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error || "Internal Server Error" });
    }
});
exports.update = update;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_1.default.delete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.deleteUser = deleteUser;
const validateUniqueEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        if (yield user_1.default.userExist(email)) {
            res.status(409).json({ message: "Email is already in use" });
        }
        else {
            res.status(200).json({ message: "Email is unique" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.validateUniqueEmail = validateUniqueEmail;
