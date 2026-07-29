// PG3-157 — POST /api/clinical-evaluations con cálculo automático de IMC (Sprint 2, Bryan Gualpa)
import { Router, Response } from 'express';
import ClinicalEvaluation from '../models/ClinicalEvaluation';
import { authGuard, AuthenticatedRequest } from '../middleware/authGuard';

const router = Router();

const toMeters = (height: number): number => (height > 3 ? height / 100 : height);

const calculateBmi = (weight: number, height: number): number => {
  const meters = toMeters(height);
  return Number((weight / (meters * meters)).toFixed(2));
};

const estimateMaintenanceCalories = (weight: number): number =>
  Math.round(weight * 30);

/**
 * @openapi
 * /api/clinical-evaluations:
 *   post:
 *     summary: Registrar una nueva evaluación clínica de un paciente
 *     tags: [Clinical Evaluations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientId, weight, height]
 *             properties:
 *               patientId:
 *                 type: integer
 *               weight:
 *                 type: number
 *                 description: Peso en kilogramos
 *               height:
 *                 type: number
 *                 description: Estatura en metros o centímetros
 *               calories:
 *                 type: number
 *                 description: Meta calórica diaria (opcional, se estima si no se envía)
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Evaluación clínica registrada correctamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso permitido solo para nutricionistas
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/',
  authGuard,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (req.user?.role !== 'nutricionista') {
        res.status(403).json({
          message: 'Forbidden - only nutritionists can register clinical evaluations',
        });
        return;
      }

      const { patientId, weight, height, calories, notes } = req.body;

      if (
        patientId === undefined ||
        typeof weight !== 'number' ||
        typeof height !== 'number' ||
        weight <= 0 ||
        height <= 0
      ) {
        res.status(400).json({
          message: 'patientId, weight (kg) and height are required and must be valid numbers',
        });
        return;
      }

      const bmi = calculateBmi(weight, height);
      const finalCalories =
        typeof calories === 'number' && calories > 0
          ? calories
          : estimateMaintenanceCalories(weight);

      const evaluation = await ClinicalEvaluation.create({
        patientId: Number(patientId),
        weight,
        height,
        bmi,
        calories: finalCalories,
        notes,
      });

      res.status(201).json({
        message: 'Clinical evaluation registered successfully.',
        data: evaluation,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error registering clinical evaluation.',
      });
    }
  }
);

/**
 * @openapi
 * /api/clinical-evaluations/patient/{id}:
 *   get:
 *     summary: Historial de evaluaciones clínicas de un paciente
 *     tags: [Clinical Evaluations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Historial obtenido correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso permitido solo para nutricionistas
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @openapi
 * /api/clinical-evaluations/patient/{id}/trends:
 *   get:
 *     summary: Tendencias clínicas del paciente (Sprint 6 — PG3-358 / HU09)
 *     description: >
 *       Series temporales de peso, IMC y meta calórica a partir del historial de evaluaciones.
 *       Soporte e-Government / EPIC-WEB-03 (visualización de evolución para el servicio preventivo).
 *     tags: [Clinical Evaluations, API-S6 Sprint 6]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Tendencias obtenidas correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       403:
 *         description: Acceso permitido solo para nutricionistas
 *       404:
 *         description: Sin evaluaciones para el paciente
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  '/patient/:id/trends',
  authGuard,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (req.user?.role !== 'nutricionista') {
        res.status(403).json({
          message: 'Forbidden - only nutritionists can access clinical trends',
        });
        return;
      }

      const evaluations = await ClinicalEvaluation.findAll({
        where: { patientId: Number(id) },
        order: [['createdAt', 'ASC']],
      });

      if (evaluations.length === 0) {
        res.status(404).json({
          message: 'No clinical evaluations found for this patient',
          data: { patientId: Number(id), trends: null },
        });
        return;
      }

      const toPoint = (e: ClinicalEvaluation, field: 'weight' | 'bmi' | 'calories') => ({
        date: e.createdAt.toISOString(),
        value: e[field],
      });

      res.status(200).json({
        message: 'Clinical evaluation trends retrieved successfully.',
        data: {
          patientId: Number(id),
          evaluationCount: evaluations.length,
          trends: {
            weight: evaluations.map((e) => toPoint(e, 'weight')),
            bmi: evaluations.map((e) => toPoint(e, 'bmi')),
            calories: evaluations.map((e) => toPoint(e, 'calories')),
          },
        },
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving clinical evaluation trends.',
      });
    }
  }
);

router.get(
  '/patient/:id',
  authGuard,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (req.user?.role !== 'nutricionista') {
        res.status(403).json({
          message: 'Forbidden - only nutritionists can access this resource',
        });
        return;
      }

      const evaluations = await ClinicalEvaluation.findAll({
        where: { patientId: Number(id) },
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json({
        message: 'Clinical evaluations history retrieved successfully.',
        data: evaluations,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error retrieving clinical evaluations history.',
      });
    }
  }
);

export default router;