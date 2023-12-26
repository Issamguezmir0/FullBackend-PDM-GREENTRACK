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
exports.CalculTotalByType = exports.CalculTotal = exports.addC = void 0;
const express_validator_1 = require("express-validator");
const Consomation_1 = __importDefault(require("../models/Consomation"));
const addC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("test");
    console.log(req.body);
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        res.status(500).json({ message: "can't add empty todo" });
        return;
    }
    const { valeur, type } = req.body;
    try {
        const cons = new Consomation_1.default(type, valeur);
        const todos = yield cons.createTodo();
        res.status(200).json({ message: "Successfully added", todos: todos });
    }
    catch (error) {
        res.status(400).json({ message: "failed to load" });
    }
});
exports.addC = addC;
const CalculTotal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the current date
        const currentDate = new Date();
        const startOfDay = new Date(currentDate.toISOString().split("T")[0]);
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);
        // Create a new Consommation instance
        const cons = new Consomation_1.default("", 0);
        // Call the gettotale function to calculate the total value for today
        const total = yield cons.calculateTotalForDay(startOfDay, endOfDay);
        // Log the response JSON in the terminal
        console.log("Response JSON:", { total: total });
        // Return the total value
        res.status(200).json({ total: total });
    }
    catch (error) {
        // Handle errors
        res.status(500).json({ message: "Failed to calculate total value" });
    }
});
exports.CalculTotal = CalculTotal;
const CalculTotalByType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("by type ");
    console.log(req.body);
    try {
        // Get the type from the request parameters
        const { type } = req.body;
        // Create a new Consommation instance
        const cons = new Consomation_1.default(type, 0);
        // Call the calculateTotalByType function to calculate the total value for the given type
        const total = yield cons.calculateTotalByType(type);
        // Log the response JSON in the terminal
        console.log("Response JSON:", { total: total });
        // Update the Consommation instance to include the total in your database
        yield cons.updateTotalInDatabase(total);
        // Return only the total value
        res.status(200).json({ total: total });
    }
    catch (error) {
        // Handle errors
        res.status(500).json({ message: "Failed to calculate total value" });
    }
});
exports.CalculTotalByType = CalculTotalByType;
