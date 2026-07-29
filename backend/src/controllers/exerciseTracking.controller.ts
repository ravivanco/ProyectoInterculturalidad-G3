import { NextFunction, Request, Response } from "express";
import { Op, WhereOptions } from "sequelize";

import Exercise from "../models/Exercise";
import ExerciseTracking, {
  ExerciseTrackingAttributes,
} from "../models/ExerciseTracking";
import PlanExercise from "../models/PlanExercise";
import User from "../models/User";

interface CreateTrackingBody {
  userId?: string;
  planExerciseId?: string;
  completed?: boolean;
  durationMinutes?: number;
  caloriesBurned?: number;
  notes?: string;
}

interface TrackingQuery {
  userId?: string;
  date?: string;
}

export const createExerciseTracking = async (
  req: Request<
    Record<string, never>,
    unknown,
    CreateTrackingBody
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      userId,
      planExerciseId,
      completed = true,
      durationMinutes,
      caloriesBurned,
      notes,
    } = req.body;

    if (!userId?.trim() || !planExerciseId?.trim()) {
      res.status(400).json({
        success: false,
        message:
          "userId y planExerciseId son obligatorios",
      });
      return;
    }

    const duration =
      durationMinutes === undefined
        ? null
        : Number(durationMinutes);

    const calories =
      caloriesBurned === undefined
        ? null
        : Number(caloriesBurned);

    if (
      (duration !== null &&
        (!Number.isFinite(duration) || duration < 0)) ||
      (calories !== null &&
        (!Number.isFinite(calories) || calories < 0))
    ) {
      res.status(400).json({
        success: false,
        message:
          "La duración y las calorías deben ser números mayores o iguales a cero",
      });
      return;
    }

    const [user, assignment] = await Promise.all([
      User.findByPk(userId),
      PlanExercise.findByPk(planExerciseId),
    ]);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "El usuario no existe",
      });
      return;
    }

    if (!assignment) {
      res.status(404).json({
        success: false,
        message:
          "La asignación del ejercicio no existe",
      });
      return;
    }

    const tracking = await ExerciseTracking.create({
      userId,
      planExerciseId,
      completed,
      durationMinutes: duration,
      caloriesBurned: calories,
      notes: notes?.trim() || null,
      completedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message:
        "Ejercicio realizado registrado correctamente",
      data: tracking,
    });
  } catch (error) {
    next(error);
  }
};

export const getExerciseTracking = async (
  req: Request<
    Record<string, never>,
    unknown,
    unknown,
    TrackingQuery
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, date } = req.query;

    const where: WhereOptions<ExerciseTrackingAttributes> =
      {};

    if (userId) {
      where.userId = userId;
    }

    if (date) {
      const startDate = new Date(`${date}T00:00:00.000Z`);
      const endDate = new Date(`${date}T00:00:00.000Z`);
      endDate.setUTCDate(endDate.getUTCDate() + 1);

      if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
      ) {
        res.status(400).json({
          success: false,
          message:
            "La fecha debe tener formato YYYY-MM-DD",
        });
        return;
      }

      where.completedAt = {
        [Op.gte]: startDate,
        [Op.lt]: endDate,
      };
    }

    const trackingRecords =
      await ExerciseTracking.findAll({
        where,
        include: [
          {
            model: PlanExercise,
            as: "planExercise",
            include: [
              {
                model: Exercise,
                as: "exercise",
              },
            ],
          },
        ],
        order: [["completedAt", "DESC"]],
      });

    res.status(200).json({
      success: true,
      message:
        "Tracking de ejercicios obtenido correctamente",
      total: trackingRecords.length,
      filters: {
        userId: userId ?? null,
        date: date ?? null,
      },
      data: trackingRecords,
    });
  } catch (error) {
    next(error);
  }
};