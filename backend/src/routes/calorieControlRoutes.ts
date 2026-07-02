import { Router, Response } from 'express';
import { authGuard, AuthenticatedRequest } from '../middleware/authGuard';
import ClinicalEvaluation from '../models/ClinicalEvaluation';

const router = Router();

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