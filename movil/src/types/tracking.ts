import type { MealSlot } from './nutritionPlan';

export type MealCompletionStatus = 'pending' | 'completed' | 'skipped';

export type PlannedMealTracking = {
  id: string;
  slot: MealSlot;
  title: string;
  calories: number;
  date: string;
  status: MealCompletionStatus;
};

export type AdditionalFoodStatus = 'draft' | 'estimated' | 'confirmed' | 'discarded';

export type AdditionalFood = {
  id: string;
  name: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUri?: string;
  status: AdditionalFoodStatus;
};

export type WeightRecord = {
  id: string;
  date: string;
  weightKg: number;
};

export type DailyTrackingSummary = {
  date: string;
  calorieGoal: number;
  plannedMeals: PlannedMealTracking[];
  additionalFoods: AdditionalFood[];
  weightHistory: WeightRecord[];
};
