import { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { appointmentsApi } from './services/appointmentsApi';
import type { Appointment } from './types';
import { AppointmentsList } from './components/AppointmentsList';
import { AppointmentFormModal } from './components/AppointmentFormModal';

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>();

  const loadAppointments = async () => {
    setIsLoading(true);
    const data = await appointmentsApi.getAppointments();
    // Sort by date ascending
    data.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    setAppointments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleOpenCreate = () => {
    setSelectedAppointment(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(undefined);
  };

  const handleSave = async () => {
    await loadAppointments();
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta cita?')) {
      await appointmentsApi.deleteAppointment(id);
      await loadAppointments();
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 relative animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <Calendar size={16} />
            <span>Módulo de Citas</span>
          </div>
          <h1 className="text-[30px] font-bold text-foreground">Gestión de Citas</h1>
          <p className="text-muted text-[13px] mt-1">Administra la agenda y asocia evaluaciones clínicas.</p>
        </div>
        
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-full font-semibold transition-all shadow-md shadow-primary/20"
        >
          <Plus size={18} />
          <span>Nueva Cita</span>
        </button>
      </div>

      <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted">Cargando citas...</div>
        ) : (
          <AppointmentsList 
            appointments={appointments} 
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onStatusChange={loadAppointments}
          />
        )}
      </div>

      {isModalOpen && (
        <AppointmentFormModal
          appointment={selectedAppointment}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
