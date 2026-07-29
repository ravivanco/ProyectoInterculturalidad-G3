import {
  NextFunction,
  Request,
  Response,
} from "express";

import Alert from "../models/Alert";
import { evaluateAutomaticAlerts } from "../services/alertEvaluation.service";

interface AlertQuery {
  userId?: string;
  status?: "activa" | "leida" | "resuelta";
  type?:
    | "BAJA_ADHERENCIA"
    | "INACTIVIDAD"
    | "EXCESO_CALORICO";
}

interface AlertParams {
  id: string;
}

export const getAlerts = async (
  req: Request<
    Record<string, never>,
    unknown,
    unknown,
    AlertQuery
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, status, type } =
      req.query;

    const alerts = await Alert.findAll({
      where: {
        ...(userId ? { userId } : {}),
        ...(status ? { status } : {}),
        ...(type ? { type } : {}),
      },
      order: [["detectedAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message:
        "Alertas obtenidas correctamente",
      total: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

export const evaluateAlerts = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result =
      await evaluateAutomaticAlerts();

    res.status(200).json({
      success: true,
      message:
        "Evaluación automática ejecutada correctamente",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const markAlertAsRead = async (
  req: Request<AlertParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const alert = await Alert.findByPk(
      req.params.id
    );

    if (!alert) {
      res.status(404).json({
        success: false,
        message: "La alerta no existe",
      });
      return;
    }

    alert.status = "leida";
    await alert.save();

    res.status(200).json({
      success: true,
      message: "Alerta marcada como leída",
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

export const resolveAlert = async (
  req: Request<AlertParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const alert = await Alert.findByPk(
      req.params.id
    );

    if (!alert) {
      res.status(404).json({
        success: false,
        message: "La alerta no existe",
      });
      return;
    }

    alert.status = "resuelta";
    await alert.save();

    res.status(200).json({
      success: true,
      message: "Alerta resuelta correctamente",
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};