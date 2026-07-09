import { Router, Response } from 'express';
import Food from '../models/Food';
import ClinicalEvaluation from '../models/ClinicalEvaluation';
import { authGuard, AuthenticatedRequest } from '../middleware/authGuard';

const router = Router();

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const MEALS = [
  { key: 'desayuno', label: 'Desayuno', ratio: 0.25 },
  { key: 'almuerzo', label: 'Almuerzo', ratio: 0.35 },
  { key: 'merienda', label: 'Merienda', ratio: 0.15 },
  { key: 'cena', label: 'Cena', ratio: 0.25 },
];

const round = (n: number): number => Math.round(n * 10) / 10;

interface PlannedItem {
  foodId: number;
  name: string;
  category: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const buildMeal = (
  foods: Food[],
  targetCalories: number,
  startIndex: number
): { items: PlannedItem[]; totalCalories: number } => {
  const items: PlannedItem[] = [];
  let accumulated = 0;
  let idx = startIndex;
  const maxItems = 3;

  while (accumulated < targetCalories * 0.9 && items.length < maxItems && foods.length > 0) {
    const food = foods[idx % foods.length];
    idx += 1;

    const remaining = targetCalories - accumulated;
    const caloriesPer100 = food.calories > 0 ? food.calories : 1;
    let grams = (remaining / caloriesPer100) * 100;
    grams = Math.max(30, Math.min(grams, food.portionGrams * 2 || 250));

    const factor = grams / 100;
    const itemCalories = round(food.calories * factor);

    items.push({
      foodId: food.id,
      name: food.name,
      category: food.category,
      grams: round(grams),
      calories: itemCalories,
      protein: round(food.protein * factor),
      carbs: round(food.carbs * factor),
      fat: round(food.fat * factor),
    });

    accumulated += itemCalories;
  }

  return { items, totalCalories: round(accumulated) };
};

/**
 * @openapi
 * /api/recipe-generator/generate-week:
 *   post:
 *     summary: Generar un plan de comidas semanal automáticamente (generador IA)
 *     description: Construye un plan de 7 días distribuyendo el catálogo de alimentos según la meta calórica del paciente o el valor enviado.
 *     tags: [Recipe Generator]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetCalories:
 *                 type: number
 *                 description: Meta calórica diaria. Si no se envía, se usa la última evaluación del paciente o 2000.
 *               patientId:
 *                 type: integer
 *                 description: Paciente para tomar la meta calórica de su última evaluación clínica
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Filtra el catálogo por estas categorías de alimentos
 *     responses:
 *       200:
 *         description: Plan semanal generado correctamente
 *       400:
 *         description: No hay alimentos en el catálogo para generar el plan
 *       401:
 *         description: Token no proporcionado o inválido
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  '/generate-week',
  authGuard,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { targetCalories, patientId, categories } = req.body;

      let dailyCalories = Number(targetCalories);

      if (!dailyCalories && patientId !== undefined) {
        const evaluation = await ClinicalEvaluation.findOne({
          where: { patientId: Number(patientId) },
          order: [['createdAt', 'DESC']],
        });
        if (evaluation) {
          dailyCalories = evaluation.calories;
        }
      }

      if (!dailyCalories || dailyCalories <= 0) {
        dailyCalories = 2000;
      }

      const where: any = {};
      if (Array.isArray(categories) && categories.length > 0) {
        where.category = categories;
      }

      const foods = await Food.findAll({ where, order: [['id', 'ASC']] });

      if (foods.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No foods available in the catalog to generate a plan.',
        });
        return;
      }

      let rotation = 0;
      const week = DAYS.map((day) => {
        const meals = MEALS.map((meal) => {
          const mealTarget = dailyCalories * meal.ratio;
          const { items, totalCalories } = buildMeal(foods, mealTarget, rotation);
          rotation += items.length || 1;
          return {
            meal: meal.key,
            label: meal.label,
            targetCalories: round(mealTarget),
            totalCalories,
            items,
          };
        });

        const dayCalories = round(meals.reduce((sum, m) => sum + m.totalCalories, 0));

        return { day, totalCalories: dayCalories, meals };
      });

      res.status(200).json({
        success: true,
        message: 'Weekly meal plan generated successfully.',
        data: {
          targetCalories: round(dailyCalories),
          days: week,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error generating weekly meal plan.' });
    }
  }
);

export default router;
