import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import nutritionPlanWeekRoutes from "./routes/nutritionPlanWeekRoutes";
import weekMenuRoutes from "./routes/weekMenuRoutes";

import routes from "./routes";
import healthRoutes from "./routes/health.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { setupSwagger } from "./config/swagger";
import dishRoutes from "./routes/dishRoutes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Primero estos middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/nutrition-plans", nutritionPlanWeekRoutes);
app.use("/api/weeks", weekMenuRoutes);

// Luego las rutas
app.use("/", healthRoutes);
app.use("/api", routes);
app.use("/api/dishes", dishRoutes);

// Swagger
setupSwagger(app);

// Middleware de errores siempre al final
app.use(errorMiddleware);

export default app;