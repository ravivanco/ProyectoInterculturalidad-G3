import { Router } from 'express';
import authRoutes from './authRoutes';
import patientRoutes from './patientRoutes';
import clinicalEvaluationRoutes from './clinicalEvaluationRoutes';
import nutritionPlanRoutes from './nutritionPlanRoutes';
import calorieControlRoutes from './calorieControlRoutes';
import foodRoutes from './foodRoutes';
import uploadRoutes from './uploadRoutes';
import recipeGeneratorRoutes from './recipeGeneratorRoutes';
import trackingRoutes from './trackingRoutes';
import visionRoutes from './visionRoutes';
import dashboardNutritionistRoutes from './dashboardNutritionistRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/clinical-evaluations', clinicalEvaluationRoutes);
router.use('/nutrition-plans', nutritionPlanRoutes);
router.use('/calorie-control', calorieControlRoutes);
router.use('/foods', foodRoutes);
router.use('/uploads', uploadRoutes);
router.use('/recipe-generator', recipeGeneratorRoutes);
router.use('/tracking', trackingRoutes);
router.use('/vision', visionRoutes);
router.use('/dashboard', dashboardNutritionistRoutes);

export default router;