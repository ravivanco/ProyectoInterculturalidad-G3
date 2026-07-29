import { Op } from "sequelize";

import AdditionalIntake from "../models/AdditionalIntake";
import Alert, {
  AlertSeverity,
  AlertType,
} from "../models/Alert";
import ExerciseTracking from "../models/ExerciseTracking";
import User from "../models/User";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const daysAgo = (days: number): Date => {
  return new Date(Date.now() - days * DAY_IN_MS);
};

const createAlertIfMissing = async (
  userId: string,
  type: AlertType,
  message: string,
  severity: AlertSeverity,
  metadata: Record<string, unknown>
): Promise<boolean> => {
  const existingAlert = await Alert.findOne({
    where: {
      userId,
      type,
      status: "activa",
    },
  });

  if (existingAlert) {
    return false;
  }

  await Alert.create({
    userId,
    type,
    message,
    severity,
    metadata,
  });

  return true;
};

const evaluateLowAdherence = async (
  userId: string
): Promise<boolean> => {
  const since = startOfDay(daysAgo(2));

  const trackingRecords =
    await ExerciseTracking.findAll({
      where: {
        userId,
        completed: true,
        completedAt: {
          [Op.gte]: since,
        },
      },
      attributes: ["completedAt"],
    });

  const activeDays = new Set(
    trackingRecords.map((record) =>
      startOfDay(record.completedAt)
        .toISOString()
        .slice(0, 10)
    )
  ).size;

  const adherencePercentage =
    (activeDays / 3) * 100;

  if (adherencePercentage >= 30) {
    return false;
  }

  return createAlertIfMissing(
    userId,
    "BAJA_ADHERENCIA",
    "La adherencia del paciente es menor al 30 % en los últimos 3 días.",
    "alta",
    {
      evaluatedDays: 3,
      activeDays,
      adherencePercentage:
        Number(adherencePercentage.toFixed(2)),
    }
  );
};

const evaluateInactivity = async (
  userId: string
): Promise<boolean> => {
  const lastTracking =
    await ExerciseTracking.findOne({
      where: {
        userId,
      },
      order: [["completedAt", "DESC"]],
    });

  const inactivityLimit = daysAgo(2);

  if (
    lastTracking &&
    lastTracking.completedAt > inactivityLimit
  ) {
    return false;
  }

  return createAlertIfMissing(
    userId,
    "INACTIVIDAD",
    "El paciente no registra actividad desde hace 2 días o más.",
    "media",
    {
      lastActivity:
        lastTracking?.completedAt ?? null,
      inactivityDays: 2,
    }
  );
};

const evaluateCalorieExcess = async (
  userId: string
): Promise<boolean> => {
  const calorieGoal = Number(
    process.env.DAILY_CALORIE_GOAL ?? 2000
  );

  if (
    !Number.isFinite(calorieGoal) ||
    calorieGoal <= 0
  ) {
    throw new Error(
      "DAILY_CALORIE_GOAL debe ser un número positivo"
    );
  }

  const threshold = calorieGoal * 1.2;
  const twoDaysAgo = startOfDay(daysAgo(1));
  const tomorrow = startOfDay(
    new Date(Date.now() + DAY_IN_MS)
  );

  const intakeRecords =
    await AdditionalIntake.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: twoDaysAgo,
          [Op.lt]: tomorrow,
        },
      },
    });

  const caloriesByDay =
    new Map<string, number>();

  intakeRecords.forEach((record) => {
    const dateKey = startOfDay(
      record.createdAt
    )
      .toISOString()
      .slice(0, 10);

    caloriesByDay.set(
      dateKey,
      (caloriesByDay.get(dateKey) ?? 0) +
        record.calories
    );
  });

  const todayKey = startOfDay(new Date())
    .toISOString()
    .slice(0, 10);

  const yesterdayKey = startOfDay(daysAgo(1))
    .toISOString()
    .slice(0, 10);

  const todayCalories =
    caloriesByDay.get(todayKey) ?? 0;

  const yesterdayCalories =
    caloriesByDay.get(yesterdayKey) ?? 0;

  const hasExcess =
    todayCalories > threshold &&
    yesterdayCalories > threshold;

  if (!hasExcess) {
    return false;
  }

  return createAlertIfMissing(
    userId,
    "EXCESO_CALORICO",
    "El paciente superó el 120 % de su meta calórica durante 2 días consecutivos.",
    "alta",
    {
      calorieGoal,
      threshold,
      todayCalories,
      yesterdayCalories,
    }
  );
};

export interface AlertEvaluationResult {
  evaluatedUsers: number;
  createdAlerts: number;
  errors: Array<{
    userId: string;
    message: string;
  }>;
}

export const evaluateAutomaticAlerts =
  async (): Promise<AlertEvaluationResult> => {
    const users = await User.findAll({
      where: {
        role: "paciente",
      },
      attributes: ["id"],
    });

    let createdAlerts = 0;

    const errors: AlertEvaluationResult["errors"] =
      [];

    for (const user of users) {
      try {
        const results = await Promise.all([
          evaluateLowAdherence(user.id),
          evaluateInactivity(user.id),
          evaluateCalorieExcess(user.id),
        ]);

        createdAlerts += results.filter(
          Boolean
        ).length;
      } catch (error) {
        errors.push({
          userId: user.id,
          message:
            error instanceof Error
              ? error.message
              : "Error desconocido",
        });
      }
    }

    return {
      evaluatedUsers: users.length,
      createdAlerts,
      errors,
    };
  };