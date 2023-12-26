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
exports.generateResetCode = exports.sendSMS = void 0;
const twilio_1 = __importDefault(require("twilio"));
const crypto_1 = __importDefault(require("crypto"));
const accountSid = "AC31b7d020c2017393ffbd8e14095d7635";
const authToken = "3e4b0509bd182c3edf07813fc4e83c2e";
const twilioClient = (0, twilio_1.default)(accountSid, authToken);
const sendSMS = (to, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield twilioClient.messages.create({
            body,
            to,
            from: "+18773362692",
        });
    }
    catch (error) {
        console.error("Erreur lors de l'envoi du SMS :", error);
        throw error;
    }
});
exports.sendSMS = sendSMS;
const generateResetCode = () => {
    try {
        const randomBytesResult = crypto_1.default.randomBytes(3);
        return randomBytesResult.toString("hex").toUpperCase();
    }
    catch (error) {
        console.error("Erreur lors de la génération du code de réinitialisation :", error);
        throw error;
    }
};
exports.generateResetCode = generateResetCode;
