import type { Patient } from '../types';
import api from '../../../lib/axios';
import { endpoints } from '../../../lib/endpoints';

import { INITIAL_PATIENTS } from './mockPatients';

export const patientsAPI = {
  // PROYEC-407: GET /patients — Retornar listado de pacientes.
  getPatients: async (): Promise<Patient[]> => {
    try {
      const response = await api.get(endpoints.patients.list);
      if (Array.isArray(response.data) && response.data.length > 0) {
        localStorage.setItem('dkfitt_patients', JSON.stringify(response.data));
        return response.data;
      }
      return getLocalOrInitial();
    } catch {
      return getLocalOrInitial();
    }
  }
};

function getLocalOrInitial(): Patient[] {
  const saved = localStorage.getItem('dkfitt_patients');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return INITIAL_PATIENTS;
    }
  }
  return INITIAL_PATIENTS;
}
