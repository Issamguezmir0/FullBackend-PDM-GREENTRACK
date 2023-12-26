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
exports.addLike = exports.getComments = exports.addComment = exports.deleteHome = exports.updateHome = exports.addHome = exports.getAllHomes = void 0;
const home_1 = __importDefault(require("../models/home"));
const express_validator_1 = require("express-validator");
const getAllHomes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const homes = yield home_1.default.getHomes();
        res.status(200).json({ message: "Successfully loaded", homes: homes });
    }
    catch (error) {
        res.status(400).json({ message: "failed to load" });
    }
});
exports.getAllHomes = getAllHomes;
const addHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(500).json({ message: "can't add empty article" });
        return;
    }
    const { idUser, DescriptionArticle, image, comments, likes } = req.body;
    try {
        const home = new home_1.default(idUser, DescriptionArticle, image, comments, likes);
        const homes = yield home.createHome();
        res.status(200).json({ message: "Successfully added", homes: homes });
    }
    catch (error) {
        res.status(400).json({ message: "failed to load" });
    }
});
exports.addHome = addHome;
const updateHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(500).json({ message: "can't add empty todo" });
        return;
    }
    const { homeId } = req.params;
    const { idUser, DescriptionArticle, image, comments, likes } = req.body;
    const home = new home_1.default(idUser, DescriptionArticle, image, comments, likes, homeId);
    try {
        const homes = yield home.updateHome();
        res.status(200).json({ message: "Successfully updated", homes: homes });
    }
    catch (error) {
        res.status(400).json({ message: "failed to edit" });
    }
});
exports.updateHome = updateHome;
const deleteHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { homeId } = req.params;
    try {
        const homes = yield home_1.default.deleteHome(homeId);
        res.status(200).json({ message: "Successfully deleted", homes: homes });
    }
    catch (error) {
        res.status(400).json({ message: "failed to delete" });
    }
});
exports.deleteHome = deleteHome;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { homeId } = req.params;
    const { comments } = req.body;
    try {
        const home = new home_1.default("", "", "", [], 0); // Initialize a home instance to call the addComment method
        const homes = yield home.addComment(comments, homeId);
        res
            .status(200)
            .json({ message: "Comment added successfully", homes: homes });
    }
    catch (error) {
        console.error(error); // Log the error to the console for debugging
        res.status(400).json({ message: "Failed to add comment" });
    }
});
exports.addComment = addComment;
// home-controller.ts
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { homeId } = req.params;
    try {
        const home = yield home_1.default.getComments(homeId);
        res.status(200).json({
            message: "Successfully loaded comments",
            comments: home.comments,
        });
    }
    catch (error) {
        res.status(400).json({ message: "Failed to load comments" });
    }
});
exports.getComments = getComments;
const addLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { homeId } = req.params;
    try {
        const home = new home_1.default("", "", "", [], 0, homeId);
        const homes = yield home.addLike();
        console.log("Adding like to video with ID:", homeId);
        res.status(200).json({ message: "Successfully added like", homes: homes });
    }
    catch (error) {
        console.error("Failed to add like:", error);
        res.status(400).json({ message: "Failed to add like" });
    }
});
exports.addLike = addLike;
