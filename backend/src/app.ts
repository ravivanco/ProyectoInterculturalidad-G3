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
import alertRoutes from "./routes/alert.routes";
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

// Catálogo de ejercicios
app.use(
  "/api/exercises",
  exerciseRoutes
);

// Consumos adicionales
app.use(
  "/api/additional-intake",
  additionalIntakeRoutes
);

// Ejercicios asignados al plan
app.use(
  "/api/nutrition-plans/weeks/:weekId/days/:day/exercises",
  planExerciseRoutes
);

// Registro de ejercicios realizados
app.use(
  "/api/exercise-tracking",
  exerciseTrackingRoutes
);

// Sistema de alertas automáticas
app.use(
  "/api/alerts",
  alertRoutes
);

// Platos
app.use(
  "/api/dishes",
  dishRoutes
);

// Semanas del plan nutricional
app.use(
  "/api/nutrition-plans",
  nutritionPlanWeekRoutes
);

// Menús semanales
app.use(
  "/api/weeks",
  weekMenuRoutes
);

// Rutas generales
app.use("/", healthRoutes);
app.use("/api", routes);

// Swagger
setupSwagger(app);

// Middleware de errores: siempre al final
app.use(errorMiddleware);

export default app;