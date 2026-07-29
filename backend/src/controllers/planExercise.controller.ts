import { NextFunction, Request, Response } from "express";

import Exercise from "../models/Exercise";
import PlanExercise from "../models/PlanExercise";

interface PlanExerciseParams {
  weekId: string;
  day: string;
}

interface AssignExerciseBody {
  exerciseId?: string;
  sets?: number;
  repetitions?: number;
  durationMinutes?: number;
  notes?: string;
}

const parsePositiveInteger = (
  value: unknown
): number | null => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return Number.NaN;
  }

  return parsed;
};

export const assignExerciseToDay = async (
  req: Request<
    PlanExerciseParams,
    unknown,
    AssignExerciseBody
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { weekId } = req.params;
    const day = Number(req.params.day);

    const {
      exerciseId,
      sets,
      repetitions,
      durationMinutes,
      notes,
    } = req.body;

    if (!weekId?.trim()) {
      res.status(400).json({
        success: false,
        message: "El weekId es obligatorio",
      });
      return;
    }

    if (!Number.isInteger(day) || day < 1 || day > 7) {
      res.status(400).json({
        success: false,
        message: "El día debe ser un número entre 1 y 7",
      });
      return;
    }

    if (!exerciseId?.trim()) {
      res.status(400).json({
        success: false,
        message: "El exerciseId es obligatorio",
      });
      return;
    }

    const parsedSets = parsePositiveInteger(sets);
    const parsedRepetitions =
      parsePositiveInteger(repetitions);
    const parsedDuration =
      parsePositiveInteger(durationMinutes);

    if (
      Number.isNaN(parsedSets) ||
      Number.isNaN(parsedRepetitions) ||
      Number.isNaN(parsedDuration)
    ) {
      res.status(400).json({
        success: false,
        message:
          "Series, repeticiones y duración deben ser enteros positivos",
      });
      return;
    }

    const exercise = await Exercise.findByPk(
      exerciseId
    );

    if (!exercise || !exercise.active) {
      res.status(404).json({
        success: false,
        message:
          "El ejercicio no existe o está inactivo",
      });
      return;
    }

    const existingAssignment =
      await PlanExercise.findOne({
        where: {
          weekId,
          day,
          exerciseId,
        },
      });

    if (existingAssignment) {
      res.status(409).json({
        success: false,
        message:
          "El ejercicio ya está asignado a este día",
      });
      return;
    }

    const assignment = await PlanExercise.create({
      weekId,
      day,
      exerciseId,
      sets: parsedSets,
      repetitions: parsedRepetitions,
      durationMinutes: parsedDuration,
      notes: notes?.trim() || null,
    });

    const result = await PlanExercise.findByPk(
      assignment.id,
      {
        include: [
          {
            model: Exercise,
            as: "exercise",
          },
        ],
      }
    );

    res.status(201).json({
      success: true,
      message:
        "Ejercicio asignado correctamente al plan",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignedExercises = async (
  req: Request<PlanExerciseParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { weekId } = req.params;
    const day = Number(req.params.day);

    if (!Number.isInteger(day) || day < 1 || day > 7) {
      res.status(400).json({
        success: false,
        message: "El día debe ser un número entre 1 y 7",
      });
      return;
    }

    const assignments = await PlanExercise.findAll({
      where: {
        weekId,
        day,
      },
      include: [
        {
          model: Exercise,
          as: "exercise",
          where: {
            active: true,
          },
          required: false,
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      success: true,
      message:
        "Ejercicios asignados obtenidos correctamente",
      total: assignments.length,
      data: assignments,
    });
  } catch (error) {
    next(error);
  }
};