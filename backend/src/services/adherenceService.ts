// PG3-350, PG3-351 — Cálculo de adherencia (API-S5, Bryan Gualpa)
import { Op } from 'sequelize';
import MealLog from '../models/MealLog';
import ExerciseLog from '../models/ExerciseLog';
import ExtraConsumption from '../models/ExtraConsumption';

export type AdherenceKind = 'alimentaria' | 'fisica' | 'global';

export interface AdherenceResult {
  patientId: string;
  kind: AdherenceKind;
  scorePercent: number;
  mealsLogged: number;
  exercisesLogged: number;
  extraCalories: number;
  dailyCalorieTarget: number | null;
  period: { from?: string; to?: string };
}

const expectedMealsPerDay = 3;
const expectedExerciseSessionsPerWeek = 3;

export async function computeAdherence(
  patientId: string,
  kind: AdherenceKind = 'global',
  from?: Date,
  to?: Date
): Promise<AdherenceResult> {
  const dateFilter =
    from || to
      ? {
          loggedAt: {
            ...(from ? { [Op.gte]: from } : {}),
            ...(to ? { [Op.lte]: to } : {}),
          },
        }
      : {};

  const exerciseDateFilter =
    from || to
      ? {
          completedAt: {
            ...(from ? { [Op.gte]: from } : {}),
            ...(to ? { [Op.lte]: to } : {}),
          },
        }
      : {};

  const [meals, exercises, extras] = await Promise.all([
    MealLog.count({ where: { patientId, ...dateFilter } }),
    ExerciseLog.count({ where: { patientId, ...exerciseDateFilter } }),
    ExtraConsumption.findAll({ where: { patientId, ...dateFilter } }),
  ]);

  const days =
    from && to
      ? Math.max(1, Math.ceil((to.getTime() - from.getTime()) / (86400000)))
      : 7;

  const mealTarget = days * expectedMealsPerDay;
  const exerciseTarget = Math.ceil((days / 7) * expectedExerciseSessionsPerWeek) || 1;

  const mealScore = Math.min(100, Math.round((meals / mealTarget) * 100));
  const exerciseScore = Math.min(100, Math.round((exercises / exerciseTarget) * 100));
  const extraCalories = extras.reduce((s, e) => s + e.calories, 0);

  let scorePercent = Math.round((mealScore + exerciseScore) / 2);
  if (kind === 'alimentaria') scorePercent = mealScore;
  if (kind === 'fisica') scorePercent = exerciseScore;

  return {
    patientId,
    kind,
    scorePercent,
    mealsLogged: meals,
    exercisesLogged: exercises,
    extraCalories: Number(extraCalories.toFixed(1)),
    dailyCalorieTarget: null,
    period: {
      from: from?.toISOString(),
      to: to?.toISOString(),
    },
  };
}
