import type { MealSlot } from '../types/nutritionPlan';

export const mealSlotLabels: Record<MealSlot, string> = {
  breakfast: 'Desayuno',
  morningSnack: 'Media mañana',
  lunch: 'Almuerzo',
  afternoonSnack: 'Media tarde',
  dinner: 'Cena',
};

export const mealSlotOrder: MealSlot[] = ['breakfast', 'morningSnack', 'lunch', 'afternoonSnack', 'dinner'];
