import { Router, Response } from 'express';
import { Op } from 'sequelize';
import Food from '../models/Food';
import { authGuard, AuthenticatedRequest } from '../middleware/authGuard';

const router = Router();

const isNutritionist = (req: AuthenticatedRequest): boolean =>
  req.user?.role === 'nutricionista';

/**
 * @openapi
 * /api/foods:
 *   get:
 *     summary: Listar el catálogo de alimentos
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Busca alimentos por nombre (coincidencia parcial)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catálogo obtenido correctamente
 *       401:
 *         description: Token no proporcionado o inválido
 *       500:
 *         description: Error interno del servidor
 *   post:
 *     summary: Crear un alimento (solo nutricionistas)
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, calories]
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               calories: { type: number }
 *               protein: { type: number }
 *               carbs: { type: number }
 *               fat: { type: number }
 *               portionGrams: { type: number }
 *               imageUrl: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Alimento creado correctamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Solo nutricionistas pueden crear alimentos
 */
router.get(
  '/',
  authGuard,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = (req.query.search as string | undefined)?.trim();
      const category = (req.query.category as string | undefined)?.trim();
      const offset = (page - 1) * limit;

      const where: any = {};
      if (search) {
        where.name = { [Op.iLike]: `%${search}%` };
      }
      if (category) {
        where.category = category;
      }

      const { count, rows } = await Food.findAndCountAll({
        where,
        limit,
        offset,
        order: [['name', 'ASC']],
      });

      res.status(200).json({
        success: true,
        message: 'Foods retrieved successfully.',
        data: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
          foods: rows,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error retrieving foods.' });
    }
  }
);

router.post(
  '/',
  authGuard,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!isNutritionist(req)) {
        res.status(403).json({ success: false, message: 'Forbidden - only nutritionists can create foods' });
        return;
      }

      const { name, category, calories, protein, carbs, fat, portionGrams, imageUrl, description } = req.body;

      if (!name || !category || typeof calories !== 'number' || calories < 0) {
        res.status(400).json({ success: false, message: 'name, category and a valid calories value are required' });
        return;
      }

      const food = await Food.create({
        name,
        category,
        calories,
        protein,
        carbs,
        fat,
        portionGrams,
        imageUrl,
        description,
      });

      res.status(201).json({ success: true, message: 'Food created successfully.', data: food });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating food.' });
    }
  }
);

/**
 * @openapi
 * /api/foods/{id}:
 *   get:
 *     summary: Obtener un alimento por id
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Alimento obtenido }
 *       404: { description: Alimento no encontrado }
 *   put:
 *     summary: Actualizar un alimento (solo nutricionistas)
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Alimento actualizado }
 *       403: { description: Solo nutricionistas }
 *       404: { description: Alimento no encontrado }
 *   delete:
 *     summary: Eliminar un alimento (solo nutricionistas)
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Alimento eliminado }
 *       403: { description: Solo nutricionistas }
 *       404: { description: Alimento no encontrado }
 */
router.get(
  '/:id',
  authGuard,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const food = await Food.findByPk(Number(req.params.id));
      if (!food) {
        res.status(404).json({ success: false, message: 'Food not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Food retrieved successfully.', data: food });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error retrieving food.' });
    }
  }
);

router.put(
  '/:id',
  authGuard,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!isNutritionist(req)) {
        res.status(403).json({ success: false, message: 'Forbidden - only nutritionists can update foods' });
        return;
      }

      const food = await Food.findByPk(Number(req.params.id));
      if (!food) {
        res.status(404).json({ success: false, message: 'Food not found.' });
        return;
      }

      const { name, category, calories, protein, carbs, fat, portionGrams, imageUrl, description } = req.body;

      if (name !== undefined) food.name = name;
      if (category !== undefined) food.category = category;
      if (calories !== undefined) food.calories = calories;
      if (protein !== undefined) food.protein = protein;
      if (carbs !== undefined) food.carbs = carbs;
      if (fat !== undefined) food.fat = fat;
      if (portionGrams !== undefined) food.portionGrams = portionGrams;
      if (imageUrl !== undefined) food.imageUrl = imageUrl;
      if (description !== undefined) food.description = description;

      await food.save();

      res.status(200).json({ success: true, message: 'Food updated successfully.', data: food });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating food.' });
    }
  }
);

router.delete(
  '/:id',
  authGuard,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!isNutritionist(req)) {
        res.status(403).json({ success: false, message: 'Forbidden - only nutritionists can delete foods' });
        return;
      }

      const food = await Food.findByPk(Number(req.params.id));
      if (!food) {
        res.status(404).json({ success: false, message: 'Food not found.' });
        return;
      }

      await food.destroy();

      res.status(200).json({ success: true, message: 'Food deleted successfully.' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting food.' });
    }
  }
);

export default router;
