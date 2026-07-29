import { NextFunction, Request, Response } from 'express';
import { Op, WhereOptions } from 'sequelize';

import Exercise, {
  ExerciseAttributes,
  ExerciseDifficulty,
} from '../models/Exercise';

interface ExerciseQuery {
  category?: string;
  difficulty?: ExerciseDifficulty;
  muscleGroup?: string;
  search?: string;
}

interface RecommendationQuery {
  level?: ExerciseDifficulty;
  objective?: string;
  muscleGroup?: string;
  limit?: string;
}

const validDifficulties: ExerciseDifficulty[] = [
  'principiante',
  'intermedio',
  'avanzado',
];

export const getExercises = async (
  req: Request<
    Record<string, never>,
    unknown,
    unknown,
    ExerciseQuery
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      category,
      difficulty,
      muscleGroup,
      search,
    } = req.query;

    if (
      difficulty &&
      !validDifficulties.includes(difficulty)
    ) {
      res.status(400).json({
        success: false,
        message:
          'La dificultad debe ser principiante, intermedio o avanzado',
      });
      return;
    }

    const where: WhereOptions<ExerciseAttributes> = {
      active: true,
    };

    if (category) {
      where.category = {
        [Op.iLike]: `%${category}%`,
      };
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (muscleGroup) {
      where.muscleGroup = {
        [Op.iLike]: `%${muscleGroup}%`,
      };
    }

    if (search) {
      Object.assign(where, {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            category: {
              [Op.iLike]: `%${search}%`,
            },
          },
        ],
      });
    }

    const exercises = await Exercise.findAll({
      where,
      order: [['name', 'ASC']],
    });

    res.status(200).json({
      success: true,
      message: 'Ejercicios obtenidos correctamente',
      total: exercises.length,
      data: exercises,
    });
  } catch (error) {
    next(error);
  }
};

export const getExerciseRecommendations = async (
  req: Request<
    Record<string, never>,
    unknown,
    unknown,
    RecommendationQuery
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      level,
      objective,
      muscleGroup,
      limit = '5',
    } = req.query;

    if (level && !validDifficulties.includes(level)) {
      res.status(400).json({
        success: false,
        message:
          'El nivel debe ser principiante, intermedio o avanzado',
      });
      return;
    }

    const parsedLimit = Number(limit);

    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > 20
    ) {
      res.status(400).json({
        success: false,
        message:
          'El límite debe ser un número entero entre 1 y 20',
      });
      return;
    }

    const where: WhereOptions<ExerciseAttributes> = {
      active: true,
    };

    if (level) {
      where.difficulty = level;
    }

    if (muscleGroup) {
      where.muscleGroup = {
        [Op.iLike]: `%${muscleGroup}%`,
      };
    }

    const normalizedObjective =
      objective?.trim().toLowerCase();

    if (
      normalizedObjective === 'perder peso' ||
      normalizedObjective === 'bajar peso' ||
      normalizedObjective === 'quemar grasa'
    ) {
      where.category = {
        [Op.iLike]: '%cardio%',
      };
    }

    if (
      normalizedObjective === 'ganar masa muscular' ||
      normalizedObjective === 'fuerza'
    ) {
      where.category = {
        [Op.iLike]: '%fuerza%',
      };
    }

    if (
      normalizedObjective === 'flexibilidad' ||
      normalizedObjective === 'movilidad'
    ) {
      where.category = {
        [Op.iLike]: '%flexibilidad%',
      };
    }

    const recommendations = await Exercise.findAll({
      where,
      limit: parsedLimit,
      order: [
        ['caloriesPerMinute', 'DESC'],
        ['name', 'ASC'],
      ],
    });

    res.status(200).json({
      success: true,
      message:
        'Recomendaciones obtenidas correctamente',
      total: recommendations.length,
      filters: {
        level: level ?? null,
        objective: objective ?? null,
        muscleGroup: muscleGroup ?? null,
        limit: parsedLimit,
      },
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};