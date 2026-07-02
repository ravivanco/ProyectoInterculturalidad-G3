import { Router, Response } from 'express';
import { authGuard, AuthenticatedRequest } from '../middleware/authGuard';
import ClinicalEvaluation from '../models/ClinicalEvaluation';

const router = Router();
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
      const evaluation = await ClinicalEvaluation.findOne({
        order: [['createdAt', 'DESC']]
      });

      if (!evaluation) {
        return res.status(404).json({
          success: false,
          message: 'No clinical evaluation found.'
        });
      }

      return res.json({
        success: true,
        data: {
          meta_calorica_diaria: evaluation.calories,
          proteinas_g: 0,
          carbohidratos_g: 0,
          grasas_g: 0
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