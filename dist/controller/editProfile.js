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
const user_1 = __importDefault(require("../models/user"));
const editProfile = {
    editProfile: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.userId;
            const { fullname, adresse, email, cin, num_tel, img } = req.body;
            const user = yield user_1.default.getUserById(userId);
            user.fullname = fullname || user.fullname;
            user.adresse = adresse || user.adresse;
            user.email = email || user.email;
            user.cin = cin || user.cin;
            user.num_tel = num_tel || user.num_tel;
            user.img = img || user.img;
            yield user.updateProfile();
            res
                .status(200)
                .json({ success: true, message: "Profile updated successfully" });
        }
        catch (error) {
            console.error("Error in edit profile:", error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error" });
        }
    }),
    getProfile: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.userId;
            const user = yield user_1.default.getUserById(userId);
            if (user !== user_1.default.empty) {
                res.status(200).json({
                    success: true,
                    message: "Profile data retrieved successfully",
                    profile: {
                        id: user.id,
                        fullname: user.fullname,
                        adresse: user.adresse,
                        email: user.email,
                        cin: user.cin,
                        num_tel: user.num_tel,
                        img: user.img,
                        age: user.age
                    },
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
        }
        catch (error) {
            console.error("Error in get profile:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }),
    updateProfileImage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.userId.trim();
            console.log("UserID:", userId);
            if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
                console.log("Invalid UserID:", userId);
                return res.status(400).json({
                    success: false,
                    message: "ID d'utilisateur invalide",
                });
            }
            const user = yield user_1.default.getUserById(userId);
            if (user !== user_1.default.empty) {
                if (!req.file) {
                    return res.status(400).json({
                        success: false,
                        message: "Veuillez télécharger une image de profil valide.",
                    });
                }
                user.img = req.file.buffer.toString("base64");
                try {
                    yield user.updateProfileImage();
                }
                catch (updateError) {
                    console.error("Erreur lors de la mise à jour de l'image de profil:", updateError);
                    console.error(updateError.stack);
                    return res.status(500).json({
                        success: false,
                        message: "Erreur lors de la mise à jour de l'image de profil",
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: "Image de profil mise à jour avec succès",
                    profile: {
                        id: user.id,
                        fullname: user.fullname,
                        adresse: user.adresse,
                        email: user.email,
                        cin: user.cin,
                        num_tel: user.num_tel,
                        img: user.img,
                        age: user.age
                    },
                });
            }
            else {
                return res.status(404).json({
                    success: false,
                    message: "Utilisateur non trouvé",
                });
            }
        }
        catch (error) {
            console.error("Erreur lors de la mise à jour de l'image de profil:", error);
            console.error(error.stack);
            return res.status(500).json({
                success: false,
                message: "Erreur interne du serveur",
            });
        }
    }),
};
exports.default = editProfile;
