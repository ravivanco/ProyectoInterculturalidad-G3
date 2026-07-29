import type { MenuIngredient, MenuMeal } from '../types/nutritionPlan';

const baseIngredients: MenuIngredient[] = [
  { name: 'Proteína principal', quantity: '1 porción' },
  { name: 'Vegetales frescos', quantity: '1 taza' },
  { name: 'Carbohidrato integral', quantity: '1/2 taza' },
  { name: 'Aceite de oliva o aguacate', quantity: '1 cucharadita' },
];

const basePreparation = [
  'Lava y corta todos los ingredientes frescos.',
  'Cocina la proteína y el carbohidrato con poca grasa añadida.',
  'Integra los vegetales al final para conservar textura y color.',
  'Sirve la porción indicada y acompaña con agua.',
];

export function completeRecipe(meal: MenuMeal): MenuMeal {
  return {
    ...meal,
    ingredients: meal.ingredients.length ? meal.ingredients : baseIngredients,
    preparation: meal.preparation.length ? meal.preparation : basePreparation,
  };
}
