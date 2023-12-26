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
exports.changePassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        console.log('Received request to change password. User ID:', userId);
        //jib data
        const user = yield user_1.default.getUserById(userId);
        console.log('User from database:', user);
        if (user === user_1.default.empty) {
            console.log('User not found.');
            res.status(404).json({ message: "Utilisateur non trouvé." });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
        console.log('Is password valid:', isPasswordValid);
        if (isPasswordValid) {
            const newHashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            yield user.updatePassword(newHashedPassword);
            console.log('Password updated successfully.');
            res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
        }
        else {
            console.log('Incorrect current password.');
            res.status(401).json({ message: "Mot de passe actuel incorrect." });
        }
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});
exports.changePassword = changePassword;
