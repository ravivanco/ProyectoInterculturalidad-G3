import type { PatientDetail } from '../types';

const mockPatientsDb: PatientDetail[] = [
  {
    id: '1',
    name: 'Ana María Santos',
    email: 'ana.santos@email.com',
    generalState: 'Alta Adherencia',
    lastVisit: '15-jun-2026',
    phone: '+593 99 123 4567',
    age: 34,
    weight: 65,
    height: 165,
    isProfileCompleted: true,
    treatmentState: 'Activo',
    notes: 'Paciente con buena evolución física y adaptación a la dieta.',
    onboarding: {
      nivel_actividad: 'Moderada',
      condiciones: ['Hipertensión'],
      alergias: ['Mariscos'],
      intolerancias: ['Lactosa'],
      objetivo_nutricional: 'Pérdida de peso',
      deportes: ['Caminata', 'Yoga'],
      preferencias_alimenticias: ['Vegetariano parcial'],
      restricciones_alimenticias: ['Sin azúcar refinada'],
    },
    nutritionPlan: {
      id: 'plan-1',
      patientId: '1',
      status: 'borrador',
      startDate: null,
      activatedAt: null,
      moduleLocked: true,
    },
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'crodriguez@email.com',
    generalState: 'Media Adherencia',
    lastVisit: '10-jun-2026',
    phone: '+593 98 765 4321',
    age: 42,
    weight: 82,
    height: 178,
    isProfileCompleted: true,
    treatmentState: 'Suspendido',
    notes: 'Le cuesta seguir los horarios, pero mantiene las porciones.',
    onboarding: {
      nivel_actividad: 'Baja',
      condiciones: ['Diabetes tipo 2'],
      alergias: [],
      intolerancias: [],
      objetivo_nutricional: 'Control glucémico',
      deportes: ['Natación'],
      preferencias_alimenticias: ['Alto en proteína'],
      restricciones_alimenticias: ['Bajo en carbohidratos'],
    },
    nutritionPlan: {
      id: 'plan-2',
      patientId: '2',
      status: 'activo',
      startDate: '2026-06-01',
      activatedAt: '2026-06-01',
      moduleLocked: false,
    },
  },
  {
    id: '3',
    name: 'Elena Fuentes',
    email: 'elena.f@email.com',
    generalState: 'Baja Adherencia',
    lastVisit: '02-jun-2026',
    phone: '+593 97 111 2233',
    age: 28,
    weight: 70,
    height: 160,
    isProfileCompleted: false,
    treatmentState: 'Pendiente',
  },
];

export const patientAPI = {
  getPatientById: async (id: string): Promise<PatientDetail> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const patient = mockPatientsDb.find((p) => p.id === id);
        if (patient) resolve({ ...patient });
        else reject(new Error('Paciente no encontrado'));
      }, 600);
    });
  },
};
