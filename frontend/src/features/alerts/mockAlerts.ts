import type { Alert } from './types';

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a-1',
    patientId: 'p-1',
    patientName: 'Juan Pérez',
    type: 'DESVIACION_CALORICA',
    severity: 'CRITICAL',
    message: 'El paciente excedió su límite calórico por más de 800 kcal (Consumo extra de hamburguesa).',
    createdAt: new Date().toISOString(),
    isRead: false,
  },
  {
    id: 'a-2',
    patientId: 'p-2',
    patientName: 'María García',
    type: 'PESO_ESTANCADO',
    severity: 'WARNING',
    message: 'El peso del paciente se ha mantenido sin cambios por más de 2 semanas.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: false,
  },
  {
    id: 'a-3',
    patientId: 'p-3',
    patientName: 'Carlos López',
    type: 'ADHERENCIA_BAJA',
    severity: 'WARNING',
    message: 'La adherencia física ha caído al 40% en los últimos 7 días.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isRead: true,
  },
  {
    id: 'a-4',
    patientId: 'p-1',
    patientName: 'Juan Pérez',
    type: 'CUMPLIMIENTO_LOGRADO',
    severity: 'INFO',
    message: 'El paciente ha cumplido su objetivo de consumo de agua diario 5 días seguidos.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    isRead: true,
  }
];
