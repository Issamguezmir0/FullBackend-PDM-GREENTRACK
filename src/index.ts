import express, { Application } from "express";
import { Database } from "./database";
import authRouter from "./router/auth-router";
import cors from "cors";
import ForgotPasswordRoute from "./router/ForgotPasswordRoute";
import bodyParser from "body-parser";
import homeRouter from "./router/home-router";
import userRouter from "./router/user-router";
import challengeRouter from "./router/challenge-router";
import VideoRouter from "./router/video-router";
import consRouter from "./router/ConsommationRouter";
import EcoPointRouter from "./router/ConsommationRouter";
import swaggerUi from "swagger-ui-express";
import specs from "./utils/swaggerOption";
import morgan from "morgan";

const app: Application = express();
require("dotenv").config();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("public/images"));

// Serve Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/home", homeRouter);
app.use("/auth", authRouter);
app.use("/challenge", challengeRouter);
app.use("/video", VideoRouter);
app.use("/consom", consRouter);
app.use("/ecoPoint", EcoPointRouter);

app.use("/forgot-password", ForgotPasswordRoute);

app.use("/users", userRouter)

// Initialize the database and start the server
databaseInit();

async function databaseInit() {
  await Database.initilize();
  const PORT = process.env.PORT || 3002;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
