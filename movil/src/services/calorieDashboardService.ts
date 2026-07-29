import { apiRequest } from './api';
import { getToken } from './tokenStorage';

export type CalorieDashboard = {
  calorieGoal: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  hasClinicalEvaluation: boolean;
};

const fallbackDashboard: CalorieDashboard = {
  calorieGoal: 1850,
  proteinGrams: 110,
  carbsGrams: 220,
  fatGrams: 62,
  hasClinicalEvaluation: true,
};

export const calorieDashboardService = {
  async getDashboard() {
    const token = await getToken();
    if (!token) return fallbackDashboard;

    try {
      return await apiRequest<CalorieDashboard>('/calorie-control/dashboard', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      return fallbackDashboard;
    }
  },
};
