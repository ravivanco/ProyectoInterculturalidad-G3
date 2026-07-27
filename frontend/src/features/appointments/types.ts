export type AppointmentStatus = 'PROGRAMADA' | 'ATENDIDA' | 'CANCELADA' | 'REPROGRAMADA';

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string; // Optional para la UI
  dateTime: string; // ISO format
  reason: string;
  status: AppointmentStatus;
  evaluationId?: string; // Para HU40
}

export interface CreateAppointmentInput {
  patientId: string;
  dateTime: string;
  reason: string;
}

export interface UpdateAppointmentInput {
  dateTime?: string;
  reason?: string;
  status?: AppointmentStatus;
  evaluationId?: string;
}
