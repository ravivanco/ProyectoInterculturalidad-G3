import { api } from '../../../lib/axios';
import { endpoints } from '../../../lib/endpoints';
import type { Appointment, CreateAppointmentInput, UpdateAppointmentInput } from '../types';
import { INITIAL_APPOINTMENTS } from './mockAppointments';

export const appointmentsApi = {
  getAppointments: async (): Promise<Appointment[]> => {
    try {
      const response = await api.get(endpoints.appointments.list);
      if (Array.isArray(response.data) && response.data.length > 0) {
        localStorage.setItem('dkfitt_appointments', JSON.stringify(response.data));
        return response.data;
      }
      return getLocalOrInitial();
    } catch {
      return getLocalOrInitial();
    }
  },
  
  createAppointment: async (input: CreateAppointmentInput): Promise<Appointment | null> => {
    try {
      const response = await api.post(endpoints.appointments.list, input);
      return response.data;
    } catch {
      // MOCK
      const current = getLocalOrInitial();
      const newAppt: Appointment = {
        id: `apt-${Date.now()}`,
        patientId: input.patientId,
        patientName: 'Paciente (Mock)',
        dateTime: input.dateTime,
        reason: input.reason,
        status: 'PROGRAMADA'
      };
      localStorage.setItem('dkfitt_appointments', JSON.stringify([...current, newAppt]));
      return newAppt;
    }
  },

  updateAppointment: async (id: string, input: UpdateAppointmentInput): Promise<Appointment | null> => {
    try {
      const response = await api.patch(`${endpoints.appointments.list}/${id}`, input);
      return response.data;
    } catch {
      // MOCK
      const current = getLocalOrInitial();
      const idx = current.findIndex(a => a.id === id);
      if (idx > -1) {
        current[idx] = { ...current[idx], ...input };
        localStorage.setItem('dkfitt_appointments', JSON.stringify(current));
        return current[idx];
      }
      return null;
    }
  },

  deleteAppointment: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`${endpoints.appointments.list}/${id}`);
      return true;
    } catch {
      // MOCK
      const current = getLocalOrInitial();
      localStorage.setItem('dkfitt_appointments', JSON.stringify(current.filter(a => a.id !== id)));
      return true;
    }
  }
};

function getLocalOrInitial(): Appointment[] {
  const saved = localStorage.getItem('dkfitt_appointments');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  }
  return INITIAL_APPOINTMENTS;
}
