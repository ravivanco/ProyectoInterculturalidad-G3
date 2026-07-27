import type { Appointment } from '../types';

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'p-1',
    patientName: 'Juan Pérez',
    dateTime: '2026-07-30T10:00:00Z',
    reason: 'Control Mensual',
    status: 'PROGRAMADA'
  },
  {
    id: 'apt-2',
    patientId: 'p-2',
    patientName: 'María García',
    dateTime: '2026-07-28T15:30:00Z',
    reason: 'Primera Consulta',
    status: 'ATENDIDA',
    evaluationId: 'eval-1'
  },
  {
    id: 'apt-3',
    patientId: 'p-3',
    patientName: 'Carlos López',
    dateTime: '2026-07-31T09:15:00Z',
    reason: 'Entrega de Plan',
    status: 'PROGRAMADA'
  },
  {
    id: 'apt-4',
    patientId: 'p-4',
    patientName: 'Ana Martínez',
    dateTime: '2026-07-25T11:45:00Z',
    reason: 'Seguimiento',
    status: 'CANCELADA'
  }
];
