import { Router, Response } from 'express';
import NutritionPlan from '../models/NutritionPlan';
import { authGuard, AuthenticatedRequest } from '../middleware/authGuard';

const router = Router();

const updateModuleStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  enabled: boolean
): Promise<void> => {
  try {
    const { id } = req.params;

    if (req.user?.role !== 'nutricionista') {
      res.status(403).json({
        message: 'Forbidden - only nutritionists can modify nutrition plans',
      });
      return;
    }

    const plan = await NutritionPlan.findByPk(Number(id));

    if (!plan) {
      res.status(404).json({
        message: 'Nutrition plan not found',
      });
      return;
    }

    plan.modulo_habilitado = enabled;
    await plan.save();

    res.status(200).json({
      modulo_habilitado: plan.modulo_habilitado,
      updated_at: plan.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating nutrition plan module status',
    });
  }
};

router.patch(
  '/:id/lock',
  authGuard,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await updateModuleStatus(req, res, false);
  }
);

router.patch(
  '/:id/unlock',
  authGuard,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await updateModuleStatus(req, res, true);
  }
);

export default router;