// Dashboard
import { useDashboardStats } from './hooks/useDashboardStats';
import { DashboardKPIs } from './components/DashboardKPIs';
import { AlertsPanel } from './components/AlertsPanel';
import { AppointmentsPanel } from './components/AppointmentsPanel';
import { DashboardWeightChart } from './components/DashboardWeightChart';

export default function Dashboard() {
  const stats = useDashboardStats();

  return (
    <>
      <div className="mb-8">
        <div className="inline-block px-3 py-1 bg-primary/10 text-primary-hover text-[11px] font-bold rounded-full mb-3 border border-primary/20">
          Seguimiento nutricional
        </div>
        <h1 className="text-[28px] font-bold text-foreground transition-colors">Dashboard</h1>
        <p className="text-muted text-[13px] mt-1 transition-colors">Resumen clínico — Datos en tiempo real del sistema DK Fitt</p>
      </div>

      {/* KPIs del Dashboard (HU31) */}
      <DashboardKPIs stats={stats} />

      {/* Alertas y Citas (Sprint 5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <AlertsPanel />
        <AppointmentsPanel />
      </div>

      {/* Charts Area (Sprint 6) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardWeightChart />

        {/* Calorias Planificadas */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors">
           <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              <p className="text-[13px] font-bold text-foreground">Calorías Planificadas vs Consumidas</p>
            </div>
          <p className="text-[11px] text-muted mb-6">Promedio semanal - pacientes activos</p>

          {/* Fake Bar Chart */}
          <div className="h-40 flex items-end justify-around border-l border-b border-border pb-2 pl-2">
             <div className="flex gap-1 items-end h-full">
               <div className="w-3 bg-green-200 dark:bg-green-500/30 h-[80%] rounded-t-sm transition-colors"></div>
               <div className="w-3 bg-orange-200 dark:bg-orange-500/30 h-[60%] rounded-t-sm transition-colors"></div>
             </div>
             <div className="flex gap-1 items-end h-full">
               <div className="w-3 bg-green-200 dark:bg-green-500/30 h-[90%] rounded-t-sm transition-colors"></div>
               <div className="w-3 bg-orange-200 dark:bg-orange-500/30 h-[85%] rounded-t-sm transition-colors"></div>
             </div>
             <div className="flex gap-1 items-end h-full">
               <div className="w-3 bg-green-200 dark:bg-green-500/30 h-[70%] rounded-t-sm transition-colors"></div>
               <div className="w-3 bg-orange-200 dark:bg-orange-500/30 h-[50%] rounded-t-sm transition-colors"></div>
             </div>
             <div className="flex gap-1 items-end h-full">
               <div className="w-3 bg-green-200 dark:bg-green-500/30 h-[85%] rounded-t-sm transition-colors"></div>
               <div className="w-3 bg-orange-200 dark:bg-orange-500/30 h-[75%] rounded-t-sm transition-colors"></div>
             </div>
             <div className="flex gap-1 items-end h-full">
               <div className="w-3 bg-green-200 dark:bg-green-500/30 h-[95%] rounded-t-sm transition-colors"></div>
               <div className="w-3 bg-orange-200 dark:bg-orange-500/30 h-[90%] rounded-t-sm transition-colors"></div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
}
