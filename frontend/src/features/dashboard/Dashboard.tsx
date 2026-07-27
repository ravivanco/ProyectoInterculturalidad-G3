// Dashboard
import { useDashboardStats } from './hooks/useDashboardStats';
import { DashboardKPIs } from './components/DashboardKPIs';
import { AlertsPanel } from './components/AlertsPanel';
import { AppointmentsPanel } from './components/AppointmentsPanel';
import { DashboardWeightChart } from './components/DashboardWeightChart';
import { DashboardCompositionChart } from './components/DashboardCompositionChart';
import { DashboardCaloriesChart } from './components/DashboardCaloriesChart';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardWeightChart />
        <DashboardCompositionChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCaloriesChart />
      </div>
    </>
  );
}
