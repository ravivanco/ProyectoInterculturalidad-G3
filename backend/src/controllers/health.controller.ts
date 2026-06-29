import { Request, Response } from "express";

export const getApiInfo = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      name: "DK-FITT API",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    },
    message: "Información general de la API",
    statusCode: 200,
  });
};

export const getHealth = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      db: "connected",
      timestamp: new Date().toISOString(),
    },
    message: "Servidor saludable",
    statusCode: 200,
  });
};