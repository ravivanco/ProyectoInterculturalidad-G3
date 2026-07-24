export const endpoints = {
  nutritionPlans: {
    base: '/nutrition-plans',
    list: '/nutrition-plans',
    create: '/nutrition-plans',
    byPatient: (patientId: string) => `/nutrition-plans/patient/${patientId}`,
    weeklyStructure: (planId: string) => `/nutrition-plans/${planId}/weekly-structure`,
  },
  foods: {
    base: '/foods',
  },
  exercises: {
    base: '/exercises',
  },
};
