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
exports.resetPassword = exports.verifyResetCode = exports.forgotPassword = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const database_1 = require("../database");
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = database_1.Database.getDb();
    const user = yield db.collection("users").findOne({ email: req.body.email });
    if (user) {
        const randomNumber = randomIntBetween(1000, 9999);
        const success = yield sendEmail({
            from: process.env.GMAIL_USER,
            to: req.body.email,
            subject: "Password reset",
            html: `<h3>You have requested to reset your password</h3><p>Your reset code is : <b style='color : #7b2bf1'>${randomNumber}</b></p>`,
        }).catch((error) => {
            console.log(error);
            return res.status(400).json({ message: "Email could not be sent" });
        });
        // token creation
        const token = yield generateResetToken(randomNumber, req.body.email);
        if (success) {
            return res.status(200).json({ token });
        }
        else {
            return res.status(400).json({ message: "Email could not be sent" });
        }
    }
    else {
        return res.status(400).json({ message: "User does not exist" });
    }
});
exports.forgotPassword = forgotPassword;
const verifyResetCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resetCode, token } = req.body;
    let verifiedToken;
    try {
        verifiedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Could not verify code" });
    }
    if (String(verifiedToken.resetCode) === resetCode) {
        return res.status(200).json({ message: "Success" });
    }
    else {
        return res.status(400).json({ message: "Incorrect reset code" });
    }
});
exports.verifyResetCode = verifyResetCode;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, plainPassword } = req.body;
    let verifiedToken;
    try {
        verifiedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Could not verify code" });
    }
    try {
        const db = database_1.Database.getDb();
        yield db.collection("users").findOneAndUpdate({ email: verifiedToken.email }, {
            $set: {
                password: yield bcrypt_1.default.hash(plainPassword, 10),
            },
        });
        return res.status(200).json({ message: "Success" });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error" });
    }
});
exports.resetPassword = resetPassword;
const sendEmail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = yield nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });
    yield transporter.verify(function (error) {
        if (error) {
            console.log(error);
            console.log("Server not ready");
        }
        else {
            console.log("Server is ready to take our messages");
        }
    });
    yield transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return false;
        }
        else {
            console.log("Email sent: " + info.response);
            return true;
        }
    });
    return true;
});
const randomIntBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
const generateResetToken = (resetCode, email) => {
    return jsonwebtoken_1.default.sign({ resetCode, email }, process.env.JWT_SECRET, { expiresIn: "100000000" } // in Milliseconds (3600000 = 1 hour)
    );
};
