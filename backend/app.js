import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import "dotenv/config";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";

import routes from "./src/routes/index.js";
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import avatarRoutes from "./src/routes/avatar.routes.js";
import projectRoutes from "./src/routes/project.routes.js";
import labelRoutes from "./src/routes/label.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import noteRoutes from "./src/routes/note.routes.js";

import notFoundMiddleware from "./src/middleware/notFound.middleware.js";
import errorMiddleware from "./src/middleware/error.middleware.js";

const app = express();

console.log("CLIENT_URL:", process.env.CLIENT_URL);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running 🚀",
  });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/user/avatar", avatarRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/", labelRoutes);
app.use("/api/v1/", taskRoutes);
app.use("/api/v1", noteRoutes);

app.use("/api", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
