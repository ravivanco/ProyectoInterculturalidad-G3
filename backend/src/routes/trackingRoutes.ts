// API-S4 — PG3-341 a PG3-346 (Bryan Gualpa, Sprint 4)
import { Router, Response } from 'express';
import { Op } from 'sequelize';
import { authGuard, AuthenticatedRequest } from '../middleware/authGuard';
import { roleGuard } from '../middleware/roleGuard';
import { resolvePatientId } from '../utils/patientScope';
import MealLog from '../models/MealLog';
import ExerciseLog from '../models/ExerciseLog';
import WeightLog from '../models/WeightLog';
import ExtraConsumption from '../models/ExtraConsumption';

const router = Router();

const parseDateRange = (req: AuthenticatedRequest) => {
  const from = req.query.from ? new Date(String(req.query.from)) : undefined;
  const to = req.query.to ? new Date(String(req.query.to)) : undefined;
  const range =
    from || to
      ? {
          loggedAt: {
            ...(from ? { [Op.gte]: from } : {}),
            ...(to ? { [Op.lte]: to } : {}),
          },
        }
      : {};
  return { from, to, range };
};

/**
 * @openapi
 * /tracking/meals:
 *   post:
 *     summary: Registrar ingesta (PG3-341)
 *     tags: [Tracking S4]
 *     security:
 *       - bearerAuth: []
 *   get:
 *     summary: Historial de comidas del paciente
 *     tags: [Tracking S4]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/meals',
  authGuard,
  roleGuard(['paciente', 'nutricionista']),
  async (req: AuthenticatedRequest, res: Response) => {
    const patientId = resolvePatientId(req, res);
    if (!patientId) return;

    const { mealType, description, calories, loggedAt } = req.body;
    if (!mealType || !loggedAt) {
      return res.status(400).json({ success: false, message: 'mealType and loggedAt are required.' });
    }

    const row = await MealLog.create({
      patientId,
      mealType,
      description,
      calories,
      loggedAt: new Date(loggedAt),
    });
    return res.status(201).json({ success: true, data: row });
  }
);

router.get(
  '/meals',
  authGuard,
  roleGuard(['paciente', 'nutricionista']),
  async (req: AuthenticatedRequest, res: Response) => {
    const patientId = resolvePatientId(req, res);
    if (!patientId) return;
    const { range } = parseDateRange(req);

    const rows = await MealLog.findAll({
      where: { patientId, ...range },
      order: [['loggedAt', 'DESC']],
    });
    return res.json({ success: true, data: rows });
  }
);

/**
 * @openapi
 * /tracking/exercises:
 *   post:
 *     summary: Registrar sesión de ejercicio (PG3-342)
 *     tags: [Tracking S4]
 *   get:
 *     summary: Historial de ejercicios
 *     tags: [Tracking S4]
 */
router.post(
  '/exercises',
  authGuard,
  roleGuard(['paciente', 'nutricionista']),
  async (req: AuthenticatedRequest, res: Response) => {
    const patientId = resolvePatientId(req, res);
    if (!patientId) return;

    const { exerciseName, durationMinutes, completedAt } = req.body;
    if (!exerciseName || durationMinutes == null || !completedAt) {
      return res.status(400).json({
        success: false,
        message: 'exerciseName, durationMinutes and completedAt are required.',
      });
    }

    const row = await ExerciseLog.create({
      patientId,
      exerciseName,
      durationMinutes: Number(durationMinutes),
      completedAt: new Date(completedAt),
    });
    return res.status(201).json({ success: true, data: row });
  }
);

router.get(
  '/exercises',
  authGuard,
  roleGuard(['paciente', 'nutricionista']),
  async (req: AuthenticatedRequest, res: Response) => {
    const patientId = resolvePatientId(req, res);
    if (!patientId) return;

    const rows = await ExerciseLog.findAll({
      where: { patientId },
      order: [['completedAt', 'DESC']],
    });
    return res.json({ success: true, data: rows });
  }
);

/**
 * @openapi
 * /tracking/weight:
 *   post:
 *     summary: Registrar peso (PG3-343)
 *     tags: [Tracking S4]
 *   get:
 *     summary: Evolución de peso
 *     tags: [Tracking S4]
 */
router.post(
  '/weight',
  authGuard,
  roleGuard(['paciente', 'nutricionista']),
  async (req: AuthenticatedRequest, res: Response) => {
    const patientId = resolvePatientId(req, res);
    if (!patientId) return;

    const { weightKg, loggedAt } = req.body;
    if (weightKg == null || !loggedAt) {
      return res.status(400).json({ success: false, message: 'weightKg and loggedAt are required.' });
    }

    const row = await WeightLog.create({
      patientId,
      weightKg: Number(weightKg),
      loggedAt: new Date(loggedAt),
    });
    return res.status(201).json({ success: true, data: row });
  }
);

router.get(
  '/weight',
  authGuard,
  roleGuard(['paciente', 'nutricionista']),
  async (req: AuthenticatedRequest, res: Response) => {
    const patientId = resolvePatientId(req, res);
    if (!patientId) return;

    const rows = await WeightLog.findAll({
      where: { patientId },
      order: [['loggedAt', 'ASC']],
    });
    return res.json({ success: true, data: rows });
  }
);

/**
 * @openapi
 * /tracking/extra-consumptions:
 *   post:
 *     summary: Consumo fuera del menú (PG3-344)
 *     tags: [Tracking S4]
 *   get:
 *     summary: Listado de consumos adicionales
 *     tags: [Tracking S4]
 */
router.post(
  '/extra-consumptions',
  authGuard,
  roleGuard(['paciente', 'nutricionista']),
  async (req: AuthenticatedRequest, res: Response) => {
    const patientId = resolvePatientId(req, res);
    if (!patientId) return;

    const { description, calories, imageUrl, loggedAt } = req.body;
    if (!description || calories == null || !loggedAt) {
      return res.status(400).json({
        success: false,
        message: 'description, calories and loggedAt are required.',
      });
    }

    const row = await ExtraConsumption.create({
      patientId,
      description,
      calories: Number(calories),
      imageUrl,
      loggedAt: new Date(loggedAt),
    });
    return res.status(201).json({ success: true, data: row });
  }
);

router.get(
  '/extra-consumptions',
  authGuard,
  roleGuard(['paciente', 'nutricionista']),
  async (req: AuthenticatedRequest, res: Response) => {
    const patientId = resolvePatientId(req, res);
    if (!patientId) return;
    const { range } = parseDateRange(req);

    const rows = await ExtraConsumption.findAll({
      where: { patientId, ...range },
      order: [['loggedAt', 'DESC']],
    });
    return res.json({ success: true, data: rows });
  }
);

/**
 * @openapi
 * /tracking/summary:
 *   get:
 *     summary: Resumen agregado para dashboards (PG3-346)
 *     tags: [Tracking S4]
 *     parameters:
 *       - in: query
 *         name: patientId
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 */
router.get(
  '/summary',
  authGuard,
  roleGuard(['paciente', 'nutricionista']),
  async (req: AuthenticatedRequest, res: Response) => {
    const patientId = resolvePatientId(req, res);
    if (!patientId) return;
    const { range } = parseDateRange(req);
    const exerciseRange =
      req.query.from || req.query.to
        ? {
            completedAt: {
              ...(req.query.from ? { [Op.gte]: new Date(String(req.query.from)) } : {}),
              ...(req.query.to ? { [Op.lte]: new Date(String(req.query.to)) } : {}),
            },
          }
        : {};

    const [meals, exercises, weights, extras] = await Promise.all([
      MealLog.count({ where: { patientId, ...range } }),
      ExerciseLog.count({ where: { patientId, ...exerciseRange } }),
      WeightLog.count({ where: { patientId, ...range } }),
      ExtraConsumption.findAll({ where: { patientId, ...range } }),
    ]);

    const extraCalories = extras.reduce((acc, e) => acc + e.calories, 0);
    const lastWeight = await WeightLog.findOne({
      where: { patientId },
      order: [['loggedAt', 'DESC']],
    });

    return res.json({
      success: true,
      data: {
        patientId,
        counts: { meals, exercises, weightEntries: weights, extraConsumptions: extras.length },
        extraCaloriesTotal: Number(extraCalories.toFixed(1)),
        lastWeightKg: lastWeight?.weightKg ?? null,
      },
    });
  }
);

export default router;
