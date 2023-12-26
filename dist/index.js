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
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const auth_router_1 = __importDefault(require("./router/auth-router"));
const cors_1 = __importDefault(require("cors"));
const ForgotPasswordRoute_1 = __importDefault(require("./router/ForgotPasswordRoute"));
const body_parser_1 = __importDefault(require("body-parser"));
const home_router_1 = __importDefault(require("./router/home-router"));
const user_router_1 = __importDefault(require("./router/user-router"));
const challenge_router_1 = __importDefault(require("./router/challenge-router"));
const video_router_1 = __importDefault(require("./router/video-router"));
const ConsommationRouter_1 = __importDefault(require("./router/ConsommationRouter"));
const ConsommationRouter_2 = __importDefault(require("./router/ConsommationRouter"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerOption_1 = __importDefault(require("./utils/swaggerOption"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
require("dotenv").config();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/public", express_1.default.static("public/images"));
// Serve Swagger UI at /api-docs
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerOption_1.default));
app.use("/home", home_router_1.default);
app.use("/auth", auth_router_1.default);
app.use("/challenge", challenge_router_1.default);
app.use("/video", video_router_1.default);
app.use("/consom", ConsommationRouter_1.default);
app.use("/ecoPoint", ConsommationRouter_2.default);
app.use("/forgot-password", ForgotPasswordRoute_1.default);
app.use("/users", user_router_1.default);
// Initialize the database and start the server
databaseInit();
function databaseInit() {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.Database.initilize();
        const PORT = process.env.PORT || 3002;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    });
}
