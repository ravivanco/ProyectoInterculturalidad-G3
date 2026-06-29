import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    data: null,
    message: error.message || "Error interno del servidor",
    statusCode,
  });
};