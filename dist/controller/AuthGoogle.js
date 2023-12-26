"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const authController = {
    googleLogin: passport_1.default.authenticate('google', { scope: ['profile', 'email'] }),
    googleCallback: passport_1.default.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/',
    }),
    profile: (req, res) => {
        try {
            if (req.isAuthenticated()) {
                res.status(200).json({
                    success: true,
                    message: 'Utilisateur authentifié avec succès',
                    profile: req.user,
                });
            }
            else {
                res.status(401).json({
                    success: false,
                    message: 'L\'utilisateur n\'est pas authentifié',
                });
            }
        }
        catch (error) {
            console.error('Erreur dans le contrôleur de profil:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
            });
        }
    },
};
exports.default = authController;
