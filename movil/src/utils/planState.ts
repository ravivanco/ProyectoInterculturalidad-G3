import type { WeeklyNutritionPlan } from '../types/nutritionPlan';

const todayIso = new Date().toISOString().slice(0, 10);

export function isPlanBeforeStartDate(plan?: WeeklyNutritionPlan) {
  return Boolean(plan?.startDate && plan.startDate > todayIso);
}

export function isPlanBlocked(plan?: WeeklyNutritionPlan) {
  return !plan || plan.status === 'blocked' || isPlanBeforeStartDate(plan);
}

export function getPlanStateLabel(plan?: WeeklyNutritionPlan) {
  if (!plan || plan.status === 'blocked') return 'Bloqueado';
  if (isPlanBeforeStartDate(plan)) return 'Pendiente por fecha';
  if (plan.status === 'pending') return 'Pendiente';
  return 'Activo';
}
