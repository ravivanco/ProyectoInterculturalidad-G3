import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, Link as LinkIcon } from 'lucide-react';
import type { Appointment, AppointmentStatus } from '../types';
import { appointmentsApi } from '../services/appointmentsApi';
import { patientsAPI } from '../../patients/services/patientsApi';

interface Props {
  appointment?: Appointment;
  onClose: () => void;
  onSave: () => void;
}

export function AppointmentFormModal({ appointment, onClose, onSave }: Props) {
  const [patients, setPatients] = useState<{id: string, names: string}[]>([]);
  
  const [patientId, setPatientId] = useState(appointment?.patientId || '');
  const [date, setDate] = useState(appointment ? appointment.dateTime.split('T')[0] : '');
  const [time, setTime] = useState(appointment ? new Date(appointment.dateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '');
  const [reason, setReason] = useState(appointment?.reason || '');
  const [status, setStatus] = useState<AppointmentStatus>(appointment?.status || 'PROGRAMADA');
  const [evaluationId, setEvaluationId] = useState(appointment?.evaluationId || '');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Cargar pacientes para el selector
    patientsAPI.getPatients().then(data => {
      setPatients(data.map(p => ({ id: p.id, names: (p as any).names || p.name || 'Paciente' })));
      if (!appointment && data.length > 0) {
        setPatientId(data[0].id);
      }
    });
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const dateTime = new Date(`${date}T${time}`).toISOString();

    if (appointment) {
      await appointmentsApi.updateAppointment(appointment.id, {
        dateTime,
        reason,
        status,
        evaluationId: evaluationId || undefined
      });
    } else {
      await appointmentsApi.createAppointment({
        patientId,
        dateTime,
        reason
      });
    }

    setIsLoading(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface w-full max-w-md rounded-3xl border border-border shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            {appointment ? 'Editar Cita' : 'Nueva Cita'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-hover rounded-full transition-colors text-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {!appointment && (
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-1.5">Paciente</label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.names}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <CalendarIcon size={14} className="text-muted" /> Fecha
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <Clock size={14} className="text-muted" /> Hora
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-foreground mb-1.5">Motivo de Cita</label>
            <input
              type="text"
              required
              placeholder="Ej: Control Mensual, Primera Consulta"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
            />
          </div>

          {appointment && (
            <>
              <div>
                <label className="block text-[13px] font-bold text-foreground mb-1.5">Estado</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground font-medium"
                >
                  <option value="PROGRAMADA">PROGRAMADA</option>
                  <option value="ATENDIDA">ATENDIDA</option>
                  <option value="CANCELADA">CANCELADA</option>
                  <option value="REPROGRAMADA">REPROGRAMADA</option>
                </select>
              </div>

              {(status === 'ATENDIDA' || appointment.evaluationId) && (
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                  <label className="block text-[13px] font-bold text-primary mb-1.5 flex items-center gap-1.5">
                    <LinkIcon size={14} /> Vincular Evaluación (HU40)
                  </label>
                  <p className="text-xs text-muted mb-3">
                    Asocia esta cita con el ID de una evaluación clínica para mantener el historial conectado.
                  </p>
                  <input
                    type="text"
                    placeholder="ID de Evaluación (ej: eval-1)"
                    value={evaluationId}
                    onChange={(e) => setEvaluationId(e.target.value)}
                    className="w-full bg-background border border-primary/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground"
                  />
                </div>
              )}
            </>
          )}

          <div className="flex gap-3 pt-4 border-t border-border mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border text-foreground rounded-xl font-bold hover:bg-surface-hover transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Guardando...' : 'Guardar Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
