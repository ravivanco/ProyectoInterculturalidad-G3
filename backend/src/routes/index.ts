import { Router } from 'express';
import authRoutes from './authRoutes';
import patientRoutes from './patientRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);

export default router;
