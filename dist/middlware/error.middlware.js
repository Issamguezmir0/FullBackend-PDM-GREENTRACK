"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddlware = (error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "whoopss!! somthing wrong";
    res.status(status).json({ status, message });
};
exports.default = errorMiddlware;
