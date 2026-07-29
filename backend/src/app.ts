import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import healthRoutes from "./routes/health.routes";
import exerciseRoutes from "./routes/exercise.routes";
import additionalIntakeRoutes from "./routes/additionalIntake.routes";

import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  "/api/exercises",
  exerciseRoutes
);

app.use(
  "/api/additional-intake",
  additionalIntakeRoutes
);

app.use("/", healthRoutes);

app.use(errorMiddleware);

export default app;