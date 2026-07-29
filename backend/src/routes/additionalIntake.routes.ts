import { Router } from "express";

import {
  analyzeAdditionalIntake,
  confirmAdditionalIntake,
  createAdditionalIntake,
  discardAdditionalIntake,
} from "../controllers/additionalIntake.controller";

import upload from "../middleware/upload.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Additional Intake
 *   description: Gestión de consumos adicionales
 */

/**
 * @swagger
 * /additional-intake:
 *   post:
 *     summary: Crear un consumo adicional
 *     tags: [Additional Intake]
 *     responses:
 *       201:
 *         description: Consumo creado
 *       400:
 *         description: Datos inválidos
 */
router.post(
  "/",
  createAdditionalIntake
);

/**
 * @swagger
 * /additional-intake/analyze:
 *   post:
 *     summary: Analizar una imagen de comida
 *     tags: [Additional Intake]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen analizada
 *       400:
 *         description: Imagen no enviada
 */
router.post(
  "/analyze",
  upload.single("image"),
  analyzeAdditionalIntake
);

/**
 * @swagger
 * /additional-intake/{id}/confirm:
 *   patch:
 *     summary: Confirmar un consumo adicional
 *     tags: [Additional Intake]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Consumo confirmado
 *       404:
 *         description: Consumo no encontrado
 *       409:
 *         description: Estado incompatible
 */
router.patch(
  "/:id/confirm",
  confirmAdditionalIntake
);

/**
 * @swagger
 * /additional-intake/{id}/discard:
 *   post:
 *     summary: Descartar un consumo adicional
 *     tags: [Additional Intake]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Consumo descartado
 *       404:
 *         description: Consumo no encontrado
 *       409:
 *         description: Estado incompatible
 */
router.post(
  "/:id/discard",
  discardAdditionalIntake
);

export default router;