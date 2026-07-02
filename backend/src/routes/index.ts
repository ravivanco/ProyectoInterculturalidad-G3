import { Router } from 'express';
import authRoutes from './authRoutes';
import patientRoutes from './patientRoutes';
import clinicalEvaluationRoutes from './clinicalEvaluationRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/clinical-evaluations', clinicalEvaluationRoutes);

export default router;