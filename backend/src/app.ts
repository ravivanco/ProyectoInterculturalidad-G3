import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes";
import healthRoutes from "./routes/health.routes";
import exerciseRoutes from "./routes/exercise.routes";
import additionalIntakeRoutes from "./routes/additionalIntake.routes";
import planExerciseRoutes from "./routes/planExercise.routes";
import exerciseTrackingRoutes from "./routes/exerciseTracking.routes";
import dishRoutes from "./routes/dishRoutes";
import nutritionPlanWeekRoutes from "./routes/nutritionPlanWeekRoutes";
import weekMenuRoutes from "./routes/weekMenuRoutes";

import { errorMiddleware } from "./middleware/error.middleware";
import { setupSwagger } from "./config/swagger";

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

app.use("/api/exercises", exerciseRoutes);
app.use("/api/additional-intake", additionalIntakeRoutes);
app.use("/api/nutrition-plans/weeks/:weekId/days/:day/exercises", planExerciseRoutes);
app.use("/api/exercise-tracking", exerciseTrackingRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/nutrition-plans", nutritionPlanWeekRoutes);
app.use("/api/weeks", weekMenuRoutes);

app.use("/", healthRoutes);
app.use("/api", routes);

setupSwagger(app);

// Debe ir al final
app.use(errorMiddleware);

export default app;
