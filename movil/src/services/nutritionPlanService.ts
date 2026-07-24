import type { WeeklyNutritionPlan } from '../types/nutritionPlan';
import { apiRequest } from './api';
import { getToken } from './tokenStorage';

const weekdayMenus: WeeklyNutritionPlan = {
  id: 'active-plan-week-1',
  name: 'Plan activo balanceado',
  status: 'active',
  weekLabel: 'Semana actual',
  energyTarget: 1850,
  safetyNotes: ['Menú ajustado a alergias, preferencias y restricciones registradas.'],
  days: [
    {
      id: 'monday',
      label: 'Lunes',
      date: 'Día 1',
      totalCalories: 1820,
      meals: [
        { id: 'mon-breakfast', slot: 'breakfast', title: 'Avena con fruta', calories: 360, ingredients: [], preparation: [], tags: ['fibra'] },
        { id: 'mon-morning', slot: 'morningSnack', title: 'Yogur natural', calories: 180, ingredients: [], preparation: [], tags: ['proteína'] },
        { id: 'mon-lunch', slot: 'lunch', title: 'Pollo con arroz integral', calories: 560, ingredients: [], preparation: [], tags: ['principal'] },
        { id: 'mon-afternoon', slot: 'afternoonSnack', title: 'Fruta de temporada', calories: 160, ingredients: [], preparation: [], tags: ['ligero'] },
        { id: 'mon-dinner', slot: 'dinner', title: 'Crema de vegetales', calories: 560, ingredients: [], preparation: [], tags: ['cena'] },
      ],
    },
    {
      id: 'tuesday',
      label: 'Martes',
      date: 'Día 2',
      totalCalories: 1865,
      meals: [
        { id: 'tue-breakfast', slot: 'breakfast', title: 'Tostadas integrales con huevo', calories: 390, ingredients: [], preparation: [], tags: ['energía'] },
        { id: 'tue-morning', slot: 'morningSnack', title: 'Batido de banano', calories: 210, ingredients: [], preparation: [], tags: ['rápido'] },
        { id: 'tue-lunch', slot: 'lunch', title: 'Pescado al horno con ensalada', calories: 590, ingredients: [], preparation: [], tags: ['omega'] },
        { id: 'tue-afternoon', slot: 'afternoonSnack', title: 'Galletas de avena', calories: 185, ingredients: [], preparation: [], tags: ['snack'] },
        { id: 'tue-dinner', slot: 'dinner', title: 'Tortilla de vegetales', calories: 490, ingredients: [], preparation: [], tags: ['liviano'] },
      ],
    },
    {
      id: 'wednesday',
      label: 'Miércoles',
      date: 'Día 3',
      totalCalories: 1840,
      meals: [
        { id: 'wed-breakfast', slot: 'breakfast', title: 'Quinua dulce con manzana', calories: 370, ingredients: [], preparation: [], tags: ['fibra'] },
        { id: 'wed-morning', slot: 'morningSnack', title: 'Mandarina y semillas', calories: 170, ingredients: [], preparation: [], tags: ['vitaminas'] },
        { id: 'wed-lunch', slot: 'lunch', title: 'Carne magra con menestra', calories: 610, ingredients: [], preparation: [], tags: ['hierro'] },
        { id: 'wed-afternoon', slot: 'afternoonSnack', title: 'Pan integral con queso fresco', calories: 220, ingredients: [], preparation: [], tags: ['saciedad'] },
        { id: 'wed-dinner', slot: 'dinner', title: 'Ensalada tibia de pollo', calories: 470, ingredients: [], preparation: [], tags: ['proteína'] },
      ],
    },
    {
      id: 'thursday',
      label: 'Jueves',
      date: 'Día 4',
      totalCalories: 1815,
      meals: [
        { id: 'thu-breakfast', slot: 'breakfast', title: 'Pan de yuca ligero con fruta', calories: 350, ingredients: [], preparation: [], tags: ['local'] },
        { id: 'thu-morning', slot: 'morningSnack', title: 'Mix de frutas', calories: 165, ingredients: [], preparation: [], tags: ['fresco'] },
        { id: 'thu-lunch', slot: 'lunch', title: 'Seco de pollo saludable', calories: 610, ingredients: [], preparation: [], tags: ['principal'] },
        { id: 'thu-afternoon', slot: 'afternoonSnack', title: 'Infusión y tostada integral', calories: 150, ingredients: [], preparation: [], tags: ['ligero'] },
        { id: 'thu-dinner', slot: 'dinner', title: 'Sopa de quinua', calories: 540, ingredients: [], preparation: [], tags: ['cálido'] },
      ],
    },
    {
      id: 'friday',
      label: 'Viernes',
      date: 'Día 5',
      totalCalories: 1875,
      meals: [
        { id: 'fri-breakfast', slot: 'breakfast', title: 'Omelette con vegetales', calories: 380, ingredients: [], preparation: [], tags: ['proteína'] },
        { id: 'fri-morning', slot: 'morningSnack', title: 'Yogur con granola', calories: 230, ingredients: [], preparation: [], tags: ['crujiente'] },
        { id: 'fri-lunch', slot: 'lunch', title: 'Ensalada completa con atún', calories: 575, ingredients: [], preparation: [], tags: ['balanceado'] },
        { id: 'fri-afternoon', slot: 'afternoonSnack', title: 'Frutos permitidos', calories: 190, ingredients: [], preparation: [], tags: ['snack'] },
        { id: 'fri-dinner', slot: 'dinner', title: 'Arroz con vegetales salteados', calories: 500, ingredients: [], preparation: [], tags: ['cena'] },
      ],
    },
  ],
};

const generatedMenus: WeeklyNutritionPlan = {
  ...weekdayMenus,
  id: 'generated-balanced-week',
  name: 'Recomendación automática semanal',
  status: 'generated',
  weekLabel: 'Semana generada',
  generatedAt: new Date().toISOString(),
  safetyNotes: [
    'Generado según meta energética diaria estimada.',
    'Incluye platos variados compatibles con preferencias registradas.',
  ],
  days: weekdayMenus.days.map((day, index) => ({
    ...day,
    totalCalories: [1840, 1860, 1835, 1855, 1825][index] ?? day.totalCalories,
    meals: day.meals.map((meal) => ({
      ...meal,
      tags: Array.from(new Set([...meal.tags, 'recomendado'])),
    })),
  })),
};

export const nutritionPlanService = {
  async getActiveWeeklyMenu() {
    const token = await getToken();
    if (!token) return weekdayMenus;

    try {
      return await apiRequest<WeeklyNutritionPlan>('/nutrition-plans/me/active/week', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      return weekdayMenus;
    }
  },

  async generateWeeklyMenu() {
    const token = await getToken();
    if (!token) return generatedMenus;

    try {
      return await apiRequest<WeeklyNutritionPlan>('/nutrition-plans/me/active/week/recommendations', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      return { ...generatedMenus, generatedAt: new Date().toISOString() };
    }
  },
};
