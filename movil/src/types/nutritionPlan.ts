export type MealSlot = 'breakfast' | 'morningSnack' | 'lunch' | 'afternoonSnack' | 'dinner';

export type MenuIngredient = {
  name: string;
  quantity: string;
};

export type MenuMeal = {
  id: string;
  slot: MealSlot;
  title: string;
  calories: number;
  ingredients: MenuIngredient[];
  preparation: string[];
  tags: string[];
  safeForPatient?: boolean;
  restrictionNotes?: string[];
};

export type MenuDay = {
  id: string;
  label: string;
  date: string;
  totalCalories: number;
  meals: MenuMeal[];
};

export type WeeklyNutritionPlan = {
  id: string;
  name: string;
  status: 'blocked' | 'pending' | 'active' | 'generated' | 'draft';
  weekLabel: string;
  energyTarget: number;
  days: MenuDay[];
  generatedAt?: string;
  safetyNotes?: string[];
  startDate?: string;
  lockReason?: string;
};
