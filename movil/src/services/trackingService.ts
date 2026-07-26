import type { AdditionalFood, DailyTrackingSummary, MealCompletionStatus, PlannedMealTracking, WeightRecord } from '../types/tracking';

const todayIso = new Date().toISOString().slice(0, 10);

const plannedMeals: PlannedMealTracking[] = [
  { id: 'today-breakfast', slot: 'breakfast', title: 'Desayuno del plan', calories: 360, date: todayIso, status: 'pending' },
  { id: 'today-morning', slot: 'morningSnack', title: 'Media mañana del plan', calories: 180, date: todayIso, status: 'pending' },
  { id: 'today-lunch', slot: 'lunch', title: 'Almuerzo del plan', calories: 560, date: todayIso, status: 'pending' },
  { id: 'today-afternoon', slot: 'afternoonSnack', title: 'Media tarde del plan', calories: 160, date: todayIso, status: 'pending' },
  { id: 'today-dinner', slot: 'dinner', title: 'Cena del plan', calories: 540, date: todayIso, status: 'pending' },
  { id: 'future-breakfast', slot: 'breakfast', title: 'Desayuno de mañana', calories: 390, date: addDays(1), status: 'pending' },
];

const additionalFoods: AdditionalFood[] = [];

const weightHistory: WeightRecord[] = [
  { id: 'w-1', date: addDays(-3), weightKg: 72.8 },
  { id: 'w-2', date: addDays(-2), weightKg: 72.4 },
  { id: 'w-3', date: addDays(-1), weightKg: 72.1 },
];

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function cloneSummary(): DailyTrackingSummary {
  return {
    date: todayIso,
    calorieGoal: 1850,
    plannedMeals: plannedMeals.map((meal) => ({ ...meal })),
    additionalFoods: additionalFoods.map((food) => ({ ...food })),
    weightHistory: weightHistory.map((record) => ({ ...record })),
  };
}

export const trackingService = {
  async getDailySummary() {
    return cloneSummary();
  },

  async updateMealStatus(mealId: string, status: MealCompletionStatus) {
    const meal = plannedMeals.find((item) => item.id === mealId);
    if (!meal) throw new Error('Comida no encontrada.');
    if (meal.date !== todayIso) throw new Error('Solo puedes marcar comidas del día actual.');
    if (meal.status === status) return cloneSummary();
    meal.status = status;
    return cloneSummary();
  },

  async saveWeight(weightKg: number) {
    if (!Number.isFinite(weightKg) || weightKg < 20 || weightKg > 350) {
      throw new Error('Ingresa un peso válido.');
    }

    const existing = weightHistory.find((record) => record.date === todayIso);
    if (existing) {
      existing.weightKg = weightKg;
    } else {
      weightHistory.push({ id: `w-${todayIso}`, date: todayIso, weightKg });
    }

    return cloneSummary();
  },

  async addAdditionalFood(payload: { name: string; calories: number; imageUri?: string }) {
    const name = payload.name.trim();
    if (!name) throw new Error('Ingresa el nombre del alimento.');
    if (!Number.isFinite(payload.calories) || payload.calories <= 0) throw new Error('Ingresa calorías válidas.');

    additionalFoods.push({
      id: `food-${Date.now()}`,
      name,
      date: todayIso,
      calories: Math.round(payload.calories),
      protein: 0,
      carbs: 0,
      fat: 0,
      imageUri: payload.imageUri,
      status: 'confirmed',
    });

    return cloneSummary();
  },
};
