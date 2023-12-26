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
exports.deleteEco_point = exports.updateEco_point = exports.addEco_point = exports.getAllEco_points = void 0;
const eco_point_1 = __importDefault(require("../models/eco_point"));
const express_validator_1 = require("express-validator");
const getAllEco_points = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const eco_points = yield eco_point_1.default.getEco_points();
        res.status(200).json({ message: "Successfully loaded", todos: eco_points });
    }
    catch (error) {
        res.status(400).json({ message: "failed to load" });
    }
});
exports.getAllEco_points = getAllEco_points;
const addEco_point = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(500).json({ message: "can't add empty todo" });
        return;
    }
    console.log();
    const { nbrPoint, description, favoris, localisation } = req.body;
    try {
        const eco_point = new eco_point_1.default(nbrPoint, description, favoris, localisation);
        const eco_points = yield eco_point.createEco_point();
        res.status(200).json({ message: "Successfully added", todos: eco_points });
    }
    catch (error) {
        res.status(400).json({ message: "failed to load" });
    }
});
exports.addEco_point = addEco_point;
const updateEco_point = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(500).json({ message: "can't add empty eco_point" });
        return;
    }
    const { eco_pointId } = req.params;
    const { nbrPoint, description, favoris } = req.body;
    const eco_point = new eco_point_1.default(nbrPoint, description, favoris, eco_pointId);
    try {
        const eco_points = yield eco_point.updateEco_point();
        res
            .status(200)
            .json({ message: "Successfully updated", todos: eco_points });
    }
    catch (error) {
        res.status(400).json({ message: "failed to edit" });
    }
});
exports.updateEco_point = updateEco_point;
const deleteEco_point = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eco_pointId } = req.params;
    try {
        const todos = yield eco_point_1.default.deleteEco_point(eco_pointId);
        res
            .status(200)
            .json({ message: "Successfully deleted", eco_points: eco_pointId });
    }
    catch (error) {
        res.status(400).json({ message: "failed to delete" });
    }
});
exports.deleteEco_point = deleteEco_point;
