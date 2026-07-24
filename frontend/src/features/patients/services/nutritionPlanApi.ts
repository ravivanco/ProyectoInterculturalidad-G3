import type { NutritionPlan } from '../types';

const plansDb: NutritionPlan[] = [
  {
    id: 'plan-1',
    patientId: '1',
    status: 'borrador',
    startDate: null,
    activatedAt: null,
    moduleLocked: true,
  },
  {
    id: 'plan-2',
    patientId: '2',
    status: 'activo',
    startDate: '2026-06-01',
    activatedAt: '2026-06-01',
    moduleLocked: false,
  },
];

export const nutritionPlanAPI = {
  getByPatient: async (patientId: string): Promise<NutritionPlan | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(plansDb.find((p) => p.patientId === patientId) ?? null);
      }, 300);
    });
  },

  activate: async (planId: string): Promise<NutritionPlan> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const plan = plansDb.find((p) => p.id === planId);
        if (!plan) {
          reject(new Error('Plan no encontrado'));
          return;
        }
        plan.status = 'activo';
        plan.activatedAt = new Date().toISOString().slice(0, 10);
        if (!plan.startDate) plan.startDate = plan.activatedAt;
        plan.moduleLocked = false;
        resolve({ ...plan });
      }, 400);
    });
  },

  setStartDate: async (planId: string, startDate: string): Promise<NutritionPlan> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const plan = plansDb.find((p) => p.id === planId);
        if (!plan) {
          reject(new Error('Plan no encontrado'));
          return;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selected = new Date(startDate);
        if (Number.isNaN(selected.getTime())) {
          reject(new Error('Fecha inválida'));
          return;
        }
        const max = new Date(today);
        max.setMonth(max.getMonth() + 3);
        if (selected < today) {
          reject(new Error('La fecha de inicio no puede ser anterior a hoy.'));
          return;
        }
        if (selected > max) {
          reject(new Error('La fecha de inicio no puede superar 3 meses desde hoy.'));
          return;
        }
        plan.startDate = startDate;
        resolve({ ...plan });
      }, 400);
    });
  },

  setModuleLock: async (planId: string, locked: boolean): Promise<NutritionPlan> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const plan = plansDb.find((p) => p.id === planId);
        if (!plan) {
          reject(new Error('Plan no encontrado'));
          return;
        }
        plan.moduleLocked = locked;
        resolve({ ...plan });
      }, 400);
    });
  },
};
