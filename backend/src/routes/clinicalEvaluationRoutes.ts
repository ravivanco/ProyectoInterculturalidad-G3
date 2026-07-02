import { Router, Response } from 'express';
import ClinicalEvaluation from '../models/ClinicalEvaluation';
import { authGuard, AuthenticatedRequest } from '../middleware/authGuard';

const router = Router();

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