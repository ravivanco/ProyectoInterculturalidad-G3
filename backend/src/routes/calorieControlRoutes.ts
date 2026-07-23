// PG3-163 — Dashboard calórico: macros desde la última evaluación clínica (Sprint 2, Bryan Gualpa)
import { Router, Response } from 'express';
import { authGuard, AuthenticatedRequest } from '../middleware/authGuard';
import ClinicalEvaluation from '../models/ClinicalEvaluation';

const router = Router();

const PROTEIN_RATIO = 0.25;
const CARBS_RATIO = 0.45;
const FAT_RATIO = 0.3;
const KCAL_PER_GRAM_PROTEIN = 4;
const KCAL_PER_GRAM_CARBS = 4;
const KCAL_PER_GRAM_FAT = 9;

const gramsFromCalories = (
  calories: number,
  ratio: number,
  kcalPerGram: number
): number => Number(((calories * ratio) / kcalPerGram).toFixed(1));

/**
 * @openapi
 * /api/calorie-control/dashboard:
 *   get:
 *     summary: Dashboard calórico del paciente autenticado
 *     description: Retorna meta calórica diaria, proteínas, carbohidratos y grasas desde la última evaluación clínica. Los cálculos automáticos incluyen IMC, TMB, GET y distribución de macronutrientes.
 *     tags: [Calorie Control]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard calórico obtenido correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       404:
 *         description: No existe evaluación clínica para el paciente autenticado
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  '/dashboard',
  authGuard,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const patientId = Number(req.user?.userId);

      const evaluation = await ClinicalEvaluation.findOne({
        where: Number.isNaN(patientId) ? {} : { patientId },
        order: [['createdAt', 'DESC']]
      });

      if (!evaluation) {
        return res.status(404).json({
          success: false,
          message: 'No clinical evaluation found.'
        });
      }

      const calories = evaluation.calories;

      return res.json({
        success: true,
        data: {
          meta_calorica_diaria: calories,
          imc: evaluation.bmi,
          proteinas_g: gramsFromCalories(calories, PROTEIN_RATIO, KCAL_PER_GRAM_PROTEIN),
          carbohidratos_g: gramsFromCalories(calories, CARBS_RATIO, KCAL_PER_GRAM_CARBS),
          grasas_g: gramsFromCalories(calories, FAT_RATIO, KCAL_PER_GRAM_FAT)
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error.'
      });
    }
  }
);

export default router;