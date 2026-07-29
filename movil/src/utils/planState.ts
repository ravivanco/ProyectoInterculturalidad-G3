import type { WeeklyNutritionPlan } from '../types/nutritionPlan';

export function isPlanBlocked(plan?: WeeklyNutritionPlan) {
  return !plan || plan.status === 'blocked';
}

export function getPlanStateLabel(plan?: WeeklyNutritionPlan) {
  if (!plan || plan.status === 'blocked') return 'Bloqueado';
  if (plan.status === 'pending') return 'Pendiente';
  return 'Activo';
}
