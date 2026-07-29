import { Router } from 'express';

import {
  getExerciseRecommendations,
  getExercises,
} from '../controllers/exercise.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Exercises
 *   description: Catálogo y recomendaciones de ejercicios
 */

/**
 * @swagger
 * /exercises:
 *   get:
 *     summary: Obtener todos los ejercicios
 *     tags: [Exercises]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum:
 *             - principiante
 *             - intermedio
 *             - avanzado
 *       - in: query
 *         name: muscleGroup
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de ejercicios
 *       400:
 *         description: Filtros inválidos
 *       500:
 *         description: Error interno
 */
router.get('/', getExercises);

/**
 * @swagger
 * /exercises/recommendations:
 *   get:
 *     summary: Obtener recomendaciones de ejercicios
 *     tags: [Exercises]
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum:
 *             - principiante
 *             - intermedio
 *             - avanzado
 *       - in: query
 *         name: objective
 *         schema:
 *           type: string
 *         example: perder peso
 *       - in: query
 *         name: muscleGroup
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 5
 *     responses:
 *       200:
 *         description: Recomendaciones obtenidas
 *       400:
 *         description: Parámetros inválidos
 *       500:
 *         description: Error interno
 */
router.get(
  '/recommendations',
  getExerciseRecommendations
);

export default router;