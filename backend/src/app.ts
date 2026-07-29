import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import healthRoutes from "./routes/health.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import exerciseRoutes from './routes/exercise.routes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use('/api/exercises', exerciseRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", healthRoutes);

app.use(errorMiddleware);

export default app;