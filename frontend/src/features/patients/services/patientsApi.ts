import type { Patient, TreatmentState } from '../../../shared/types';

export const API_URL = 'http://localhost:3000/api';

export type PatientFilters = {
  search?: string;
  treatmentStatus?: TreatmentState | '';
};

const MOCK_PATIENTS: Patient[] = [
  { id: '1', name: 'Carlos Mendoza', email: 'carlos.m@gmail.com', generalState: 'Alta Adherencia', lastVisit: '10 Jun 2026', treatmentState: 'Activo' },
  { id: '2', name: 'Ana Gutiérrez', email: 'ana.g@hotmail.com', generalState: 'Media Adherencia', lastVisit: '12 Jun 2026', treatmentState: 'Suspendido' },
  { id: '3', name: 'Luis Ramírez', email: 'luis.ramirez@yahoo.com', generalState: 'Baja Adherencia', lastVisit: '05 Jun 2026', treatmentState: 'Pendiente' },
  { id: '4', name: 'María Fernanda Salas', email: 'mafer.salas@gmail.com', generalState: 'Alta Adherencia', lastVisit: '14 Jun 2026', treatmentState: 'Finalizado' },
  { id: '5', name: 'Jorge Villalobos', email: 'jorgev89@outlook.com', generalState: 'Pendiente', lastVisit: '16 Jun 2026', treatmentState: 'Pendiente' },
];

export const patientsAPI = {
  getPatients: async (filters: PatientFilters = {}): Promise<Patient[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...MOCK_PATIENTS];
        const term = filters.search?.trim().toLowerCase();
        if (term) {
          result = result.filter(
            (p) => p.name.toLowerCase().includes(term) || p.email.toLowerCase().includes(term),
          );
        }
        if (filters.treatmentStatus) {
          result = result.filter((p) => (p.treatmentState ?? 'Pendiente') === filters.treatmentStatus);
        }
        resolve(result);
      }, 400);
    });
  },
};
