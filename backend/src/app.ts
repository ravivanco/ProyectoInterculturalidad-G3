import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import sequelize from './config/database';
import routes from './routes';
import { setupSwagger } from './config/swagger';

dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    setupSwagger(this.app as any);
    this.errorHandling();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes(): void {
    // Basic root route
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'DK-FITT API - Sitio B (Quito)',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
      });
    });

    // Health check endpoint (Task 4 for Brandon, but we set it up to allow backend to run)
    this.app.get('/health', async (req: Request, res: Response) => {
      try {
        await sequelize.authenticate();
        res.json({
          status: 'ok',
          db: 'connected',
          timestamp: new Date(),
        });
      } catch (error: any) {
        res.status(500).json({
          status: 'error',
          db: 'disconnected',
          message: error.message,
          timestamp: new Date(),
        });
      }
    });

    // Main API routes
    this.app.use('/api', routes);
  }

  private errorHandling(): void {
    // 404 Route not found handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      const err = new Error('Not Found') as any;
      err.status = 404;
      next(err);
    });

    // Global Error Handler
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      const statusCode = err.status || 500;
      res.status(statusCode).json({
        success: false,
        statusCode,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      });
    });
  }
}

export default new App().app;
