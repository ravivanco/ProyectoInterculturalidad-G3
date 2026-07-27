import api from '../../../lib/axios';
import { endpoints } from '../../../lib/endpoints';
import { MOCK_EVALUATIONS } from './mockEvaluations';

export const patientAPI = {
  // Obtiene el perfil de un paciente (sus alergias, condiciones médicas, etc.)
  getPatientProfile: async (id: string) => {
    const response = await api.get(endpoints.patients.profile(id));
    return response.data;
  },

  // Obtiene el historial de evaluaciones clínicas
  getPatientEvaluations: async (id: string) => {
    try {
      const response = await api.get(endpoints.clinicalEvaluations.history(id));
      if (Array.isArray(response.data) && response.data.length > 0) return response.data;
      return MOCK_EVALUATIONS[id] || [];
    } catch {
      return MOCK_EVALUATIONS[id] || [];
    }
  },
  
  activatePlan: async (id: string, startDate?: string): Promise<void> => {
    const response = await api.patch(endpoints.nutritionPlans.activate(id), { startDate });
    return response.data;
  },
  
  lockPlan: async (id: string): Promise<void> => {
    const response = await api.patch(endpoints.nutritionPlans.lockModule(id), { locked: true });
    return response.data;
  },

  unlockPlan: async (id: string): Promise<void> => {
    const response = await api.patch(endpoints.nutritionPlans.unlockModule(id));
    return response.data;
  }
};
