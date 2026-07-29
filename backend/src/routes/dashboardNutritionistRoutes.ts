// API-S5 — PG3-350–355, PG3-495 (Bryan Gualpa, Sprint 5)
import { Router, Response } from 'express';
import { Op } from 'sequelize';
import { authGuard, AuthenticatedRequest } from '../middleware/authGuard';
import { roleGuard } from '../middleware/roleGuard';
import { resolvePatientId } from '../utils/patientScope';
import { computeAdherence, AdherenceKind } from '../services/adherenceService';
import PatientAlert from '../models/PatientAlert';
import MealLog from '../models/MealLog';

const router = Router();

const parseRange = (req: AuthenticatedRequest) => {
  const from = req.query.from ? new Date(String(req.query.from)) : undefined;
  const to = req.query.to ? new Date(String(req.query.to)) : undefined;
  const kind = (req.query.adherenceType as AdherenceKind) || 'global';
  return { from, to, kind };
};

/**
 * @openapi
 * /dashboard/nutritionist:
 *   get:
 *     summary: Panel consolidado nutricionista (PG3-353, PG3-355)
 *     tags: [Dashboard S5]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/nutritionist',
  authGuard,
  roleGuard(['nutricionista']),
  async (req: AuthenticatedRequest, res: Response) => {
    const patientId = resolvePatientId(req, res);
    if (!patientId) return;
    const { from, to, kind } = parseRange(req);

    const adherence = await computeAdherence(patientId, kind, from, to);
    const alerts = await PatientAlert.findAll({
      where: { patientId, acknowledged: false },
      order: [['createdAt', 'DESC']],
      limit: 20,
    });

    return res.json({
      success: true,
      data: {
        filters: { patientId, from: from?.toISOString(), to: to?.toISOString(), adherenceType: kind },
        adherence,
        openAlerts: alerts,
      },
    });
  }
);

/**
 * @openapi
 * /dashboard/nutritionist/adherence:
 *   get:
 *     summary: KPI de adherencia (PG3-351)
 *     tags: [Dashboard S5]
 */
router.get(
  '/nutritionist/adherence',
  authGuard,
  roleGuard(['nutricionista', 'paciente']),
  async (req: AuthenticatedRequest, res: Response) => {
    const patientId = resolvePatientId(req, res);
    if (!patientId) return;
    const { from, to, kind } = parseRange(req);
    const adherence = await computeAdherence(patientId, kind, from, to);
    return res.json({ success: true, data: adherence });
  }
);

/**
 * @openapi
 * /dashboard/nutritionist/adherence/detail:
 *   get:
 *     summary: Extensión adherencia Sprint 5 (PG3-495)
 *     tags: [Dashboard S5]
 */
router.get(
  '/nutritionist/adherence/detail',
  authGuard,
  roleGuard(['nutricionista']),
  async (req: AuthenticatedRequest, res: Response) => {
    const patientId = resolvePatientId(req, res);
    if (!patientId) return;
    const { from, to } = parseRange(req);

    const [alimentaria, fisica, global] = await Promise.all([
      computeAdherence(patientId, 'alimentaria', from, to),
      computeAdherence(patientId, 'fisica', from, to),
      computeAdherence(patientId, 'global', from, to),
    ]);

    return res.json({
      success: true,
      data: { alimentaria, fisica, global },
    });
  }
);

/**
 * @openapi
 * /dashboard/nutritionist/alerts:
 *   get:
 *     summary: Alertas por paciente (PG3-354)
 *     tags: [Dashboard S5]
 */
router.get(
  '/nutritionist/alerts',
  authGuard,
  roleGuard(['nutricionista', 'paciente']),
  async (req: AuthenticatedRequest, res: Response) => {
    const patientId = resolvePatientId(req, res);
    if (!patientId) return;

    const onlyOpen = req.query.open !== 'false';
    const alerts = await PatientAlert.findAll({
      where: { patientId, ...(onlyOpen ? { acknowledged: false } : {}) },
      order: [['createdAt', 'DESC']],
    });
    return res.json({ success: true, data: alerts });
  }
);

/**
 * @openapi
 * /dashboard/nutritionist/alerts/evaluate:
 *   post:
 *     summary: Generar alertas automáticas (PG3-352)
 *     tags: [Dashboard S5]
 */
router.post(
  '/nutritionist/alerts/evaluate',
  authGuard,
  roleGuard(['nutricionista']),
  async (req: AuthenticatedRequest, res: Response) => {
    const patientId = resolvePatientId(req, res);
    if (!patientId) return;

    const adherence = await computeAdherence(patientId, 'global');
    const created: PatientAlert[] = [];

    if (adherence.scorePercent < 60) {
      created.push(
        await PatientAlert.create({
          patientId,
          alertType: 'adherencia_baja',
          message: `Adherencia global ${adherence.scorePercent}% por debajo del umbral (60%).`,
          severity: 'warning',
        })
      );
    }

    if (adherence.extraCalories > 500) {
      created.push(
        await PatientAlert.create({
          patientId,
          alertType: 'consumo_extra',
          message: `Consumo adicional acumulado ${adherence.extraCalories} kcal en el periodo.`,
          severity: 'info',
        })
      );
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const todayMeals = await MealLog.count({
      where: { patientId, loggedAt: { [Op.gte]: start } },
    });

    if (todayMeals < 1) {
      created.push(
        await PatientAlert.create({
          patientId,
          alertType: 'comida_pendiente',
          message: 'Sin registros de comidas hoy; recordatorio al paciente.',
          severity: 'info',
        })
      );
    }

    return res.status(201).json({ success: true, data: { created, adherence } });
  }
);

/**
 * @openapi
 * /dashboard/nutritionist/alerts/{alertId}/ack:
 *   patch:
 *     summary: Marcar alerta atendida (soporte móvil PG3-551)
 *     tags: [Dashboard S5]
 */
router.patch(
  '/nutritionist/alerts/:alertId/ack',
  authGuard,
  roleGuard(['nutricionista', 'paciente']),
  async (req: AuthenticatedRequest, res: Response) => {
    const alert = await PatientAlert.findByPk(req.params.alertId);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found.' });
    }
    if (req.user?.role === 'paciente' && alert.patientId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    await alert.update({ acknowledged: true });
    return res.json({ success: true, data: alert });
  }
);

export default router;
