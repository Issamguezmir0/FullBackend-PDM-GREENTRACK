"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Nom de votre API',
            version: '1.0.0',
            description: 'Description de votre API',
        },
    },
    apis: ['./routes/*.ts'], // spécifiez le chemin vers vos fichiers contenant les commentaires Swagger
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.default = specs;
