import { Router, Response } from 'express';
import { authGuard, AuthenticatedRequest } from '../middleware/authGuard';
import { roleGuard } from '../middleware/roleGuard';
import { PatientProfile, User } from '../models';

const router = Router();

/**
 * @openapi
 * /patients:
 *   get:
 *     summary: Retrieve list of patients (Nutritionist only)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patients retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 statusCode:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PatientProfile'
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden - Nutritionists only
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authGuard,
  roleGuard(['nutricionista']),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const estado = req.query.estado as string | undefined;

      const offset = (page - 1) * limit;

      const whereCondition: any = {};

      if (estado) {
        whereCondition.estado_tratamiento = estado;
      }

      const { count, rows } = await PatientProfile.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'role'],
          },
        ],
      });

      const patients = rows.map((patient: any) => ({
        ...patient.toJSON(),
        estado_tratamiento: patient.estado_tratamiento || 'pendiente',
      }));

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Patients list retrieved successfully.',
        data: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
          patients,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Error retrieving patients list.',
        error: error.message,
      });
    }
  },
);

/**
 * @openapi
 * /patients/{id}:
 *   get:
 *     summary: Retrieve patient details (Nutritionist or self Patient)
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Patient Profile ID
 *     responses:
 *       200:
 *         description: Patient details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Patients can only access their own profile
 *       404:
 *         description: Patient profile not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authGuard, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const patient = await PatientProfile.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'role'],
        },
      ],
    });

    if (!patient) {
      res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Patient profile not found.',
      });
      return;
    }

    // If user is a patient, check if they are accessing their own profile
    if (req.user?.role === 'paciente' && req.user.userId !== patient.userId) {
      res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Forbidden. You can only access your own profile.',
      });
      return;
    }

    const patientData: any = patient.toJSON();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Patient profile retrieved successfully.',
      data: {
        ...patientData,
        estado_tratamiento: patientData.estado_tratamiento || 'pendiente',
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Error retrieving patient profile.',
      error: error.message,
    });
  }
});

export default router;
