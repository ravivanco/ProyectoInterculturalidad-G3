import { Router } from "express";

import {
  getNutritionistDashboard,
} from "../controllers/dashboardNutritionist.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard nutricionista
 *   description: Indicadores generales para el seguimiento de pacientes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardKpis:
 *       type: object
 *       properties:
 *         total_pacientes:
 *           type: integer
 *           example: 10
 *         pacientes_activos:
 *           type: integer
 *           example: 7
 *         promedio_adherencia:
 *           type: number
 *           format: float
 *           example: 72.5
 *         alertas_nuevas:
 *           type: integer
 *           example: 3
 *         pacientes_en_riesgo:
 *           type: integer
 *           example: 2
 */

/**
 * @swagger
 * /api/dashboard/nutritionist:
 *   get:
 *     summary: Obtener los KPIs generales del nutricionista
 *     description: Retorna indicadores del día actual y una comparación con la semana anterior.
 *     tags:
 *       - Dashboard nutricionista
 *     responses:
 *       200:
 *         description: KPIs obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: KPIs del dashboard obtenidos correctamente
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/DashboardKpis'
 *                     - type: object
 *                       properties:
 *                         comparativa_semana_anterior:
 *                           type: object
 *                           properties:
 *                             datos_semana_anterior:
 *                               $ref: '#/components/schemas/DashboardKpis'
 *                             variacion_porcentual:
 *                               $ref: '#/components/schemas/DashboardKpis'
 *       500:
 *         description: Error interno del servidor
 */
router.get(
  "/nutritionist",
  getNutritionistDashboard
);

export default router;