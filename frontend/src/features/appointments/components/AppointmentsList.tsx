import { useState, useMemo } from 'react';
import { Clock, Edit2, Trash2, CheckCircle, XCircle, Activity } from 'lucide-react';
import type { Appointment, AppointmentStatus } from '../types';
import { appointmentsApi } from '../services/appointmentsApi';

interface Props {
  appointments: Appointment[];
  onEdit: (appt: Appointment) => void;
  onDelete: (id: string) => void;
  onStatusChange: () => void;
}

export function AppointmentsList({ appointments, onEdit, onDelete, onStatusChange }: Props) {
  const [filter, setFilter] = useState<AppointmentStatus | 'TODAS'>('TODAS');

  const filteredAppointments = useMemo(() => {
    if (filter === 'TODAS') return appointments;
    return appointments.filter(a => a.status === filter);
  }, [appointments, filter]);

  const handleStatusUpdate = async (id: string, newStatus: AppointmentStatus) => {
    await appointmentsApi.updateAppointment(id, { status: newStatus });
    onStatusChange();
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'PROGRAMADA': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'ATENDIDA': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'CANCELADA': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      case 'REPROGRAMADA': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    }
  };

  return (
    <div className="flex flex-col">
      {/* Filtros */}
      <div className="p-4 border-b border-border bg-surface flex flex-wrap gap-2">
        {(['TODAS', 'PROGRAMADA', 'ATENDIDA', 'CANCELADA', 'REPROGRAMADA'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors border ${
              filter === status
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface-hover text-muted border-border hover:text-foreground'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-hover/50 text-[11px] uppercase tracking-wider text-muted font-bold">
              <th className="p-4">Paciente</th>
              <th className="p-4">Fecha y Hora</th>
              <th className="p-4">Motivo</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Evaluación Asoc.</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted">
                  No se encontraron citas con estos filtros.
                </td>
              </tr>
            ) : (
              filteredAppointments.map(appt => (
                <tr key={appt.id} className="border-b border-border hover:bg-surface-hover/50 transition-colors">
                  <td className="p-4 font-semibold text-foreground">
                    {appt.patientName || 'Paciente'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-muted">
                      <Clock size={14} className="text-primary" />
                      <span className="font-medium text-foreground">
                        {new Date(appt.dateTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-muted font-medium">{appt.reason}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wider border ${getStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {appt.evaluationId ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
                        <Activity size={12} />
                        Vinculada
                      </span>
                    ) : (
                      <span className="text-xs text-muted/50 italic font-medium">-</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {appt.status === 'PROGRAMADA' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(appt.id, 'ATENDIDA')}
                            className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors"
                            title="Marcar Atendida"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appt.id, 'CANCELADA')}
                            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors"
                            title="Cancelar Cita"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onEdit(appt)}
                        className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors"
                        title="Editar / Vincular"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(appt.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
