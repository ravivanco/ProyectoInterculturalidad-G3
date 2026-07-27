import type { Patient } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-1',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    generalState: 'Alta Adherencia',
    treatmentState: 'Activo',
    lastVisit: '2026-07-20T10:00:00Z'
  },
  {
    id: 'p-2',
    name: 'María García',
    email: 'maria.garcia@example.com',
    generalState: 'Media Adherencia',
    treatmentState: 'Activo',
    lastVisit: '2026-07-15T15:30:00Z'
  },
  {
    id: 'p-3',
    name: 'Carlos López',
    email: 'carlos.lopez@example.com',
    generalState: 'Baja Adherencia',
    treatmentState: 'Pendiente',
    lastVisit: '2026-07-10T09:15:00Z'
  },
  {
    id: 'p-4',
    name: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    generalState: 'Alta Adherencia',
    treatmentState: 'Suspendido',
    lastVisit: '2026-06-25T11:45:00Z'
  }
];
