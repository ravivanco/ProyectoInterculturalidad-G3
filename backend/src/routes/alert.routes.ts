import { Router } from "express";

import {
  evaluateAlerts,
  getAlerts,
  markAlertAsRead,
  resolveAlert,
} from "../controllers/alert.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Alertas
 *   description: Gestión de alertas automáticas de seguimiento nutricional
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Alert:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 8dd6d889-05dd-4ea1-bf09-159dcc889615
 *         userId:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           enum:
 *             - BAJA_ADHERENCIA
 *             - INACTIVIDAD
 *             - EXCESO_CALORICO
 *           example: INACTIVIDAD
 *         severity:
 *           type: string
 *           enum:
 *             - baja
 *             - media
 *             - alta
 *           example: media
 *         status:
 *           type: string
 *           enum:
 *             - activa
 *             - leida
 *             - resuelta
 *           example: activa
 *         message:
 *           type: string
 *           example: El paciente no ha registrado actividad durante los últimos dos días.
 *         metadata:
 *           type: object
 *           nullable: true
 *         detectedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Consultar las alertas registradas
 *     tags:
 *       - Alertas
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar alertas por paciente
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - activa
 *             - leida
 *             - resuelta
 *         description: Filtrar alertas por estado
 *     responses:
 *       200:
 *         description: Alertas obtenidas correctamente
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
 *                   example: Alertas obtenidas correctamente
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Alert'
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", getAlerts);

/**
 * @swagger
 * /api/alerts/evaluate:
 *   post:
 *     summary: Ejecutar manualmente la evaluación automática de alertas
 *     description: Evalúa baja adherencia, inactividad y exceso calórico de los pacientes.
 *     tags:
 *       - Alertas
 *     responses:
 *       200:
 *         description: Evaluación de alertas completada
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
 *                   example: Evaluación de alertas completada correctamente
 *                 alertsCreated:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Error durante la evaluación
 */
router.post("/evaluate", evaluateAlerts);

/**
 * @swagger
 * /api/alerts/{id}/read:
 *   patch:
 *     summary: Marcar una alerta como leída
 *     tags:
 *       - Alertas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador de la alerta
 *     responses:
 *       200:
 *         description: Alerta marcada como leída
 *       404:
 *         description: Alerta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.patch("/:id/read", markAlertAsRead);

/**
 * @swagger
 * /api/alerts/{id}/resolve:
 *   patch:
 *     summary: Resolver una alerta
 *     tags:
 *       - Alertas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Identificador de la alerta
 *     responses:
 *       200:
 *         description: Alerta resuelta correctamente
 *       404:
 *         description: Alerta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.patch("/:id/resolve", resolveAlert);

export default router;