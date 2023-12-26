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
exports.deleteChallenge = exports.updateChallenge = exports.addChallenge = exports.getAllChallenge = void 0;
const challenge_1 = __importDefault(require("../models/challenge"));
const express_validator_1 = require("express-validator");
const getAllChallenge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield challenge_1.default.getChallenge();
        res.status(200).json({ message: "Successfully loaded", events: events });
    }
    catch (error) {
        res.status(400).json({ message: "Failed to load" });
    }
});
exports.getAllChallenge = getAllChallenge;
// export const addChallenge = async (req: Request, res: Response) => {
//   const { title, description, date, location, isFree, participants, organisateurs, details,image } = req.body;
// try{
//   const challenge = new Challenge(
//       title,
//       description,
//       date,
//       location,
//       isFree,
//       participants,
//       organisateurs,
//       details,
//       `${req.protocol}://${req.get('host')}/img/${req.file.filename}`,
//  );
// }catch(error){
//   console.log(error);
//   res.status(500)
// }
// };
// export const addChallenge = async (req: Request, res: Response) => {
//   const result = validationResult(req);
//   if (!result.isEmpty()) {
//     res.status(500).json({ message: "Can't add an empty challenge" });
//     return;
//   }
//   const { image,title, description, date, location, isFree, participants, organisateurs, details } = req.body;
//   try {
//     const challenge = new Challenge(image, title, description, date, location, isFree, participants, organisateurs, details);
//     const events = await challenge.createChallenge();
//     res.status(200).json({ message: "Successfully added", events: events });
//   } catch (error) {
//     res.status(400).json({ message: "Failed to add" });
//   }
// };
const addChallenge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = (0, express_validator_1.validationResult)(req);
        if (!result.isEmpty()) {
            res.status(500).json({ message: "Can't add an empty challenge" });
            return;
        }
        const json = req.body; // Removed JSON.parse
        // Extract other challenge-related data from req.body
        const { title, description, date, location, isFree, participants, organisateurs, details, price, } = json;
        // Extract image information from req.file
        const image = req.file
            ? req.file.destination.replace(".", "") + "/" + req.file.filename
            : "";
        try {
            // Create a new Challenge instance with the image path and other details
            const challenge = new challenge_1.default(image, title, description, date, location, isFree, participants, organisateurs, details, price);
            // Call the method to create the challenge
            const events = yield challenge.createChallenge();
            res.status(200).json({ message: "Successfully added", events: events });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ message: "Failed to add" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addChallenge = addChallenge;
const updateChallenge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(500).json({ message: "Can't update with empty values" });
        return;
    }
    const { challengeId } = req.params;
    const { image, title, description, date, location, isFree, participants, organisateurs, details, price, } = req.body;
    try {
        const challenge = new challenge_1.default(image, title, description, date, location, isFree, participants, organisateurs, details, price, challengeId);
        const events = yield challenge.updateChallenge();
        res.status(200).json({ message: "Successfully updated", events: events });
    }
    catch (error) {
        res.status(400).json({ message: "Failed to update" });
    }
});
exports.updateChallenge = updateChallenge;
const deleteChallenge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { challengeId } = req.params;
    try {
        const events = yield challenge_1.default.deleteChallenge(challengeId);
        res.status(200).json({ message: "Successfully deleted", events: events });
    }
    catch (error) {
        res.status(400).json({ message: "Failed to delete" });
    }
});
exports.deleteChallenge = deleteChallenge;
