import { useState } from 'react';
import { Calendar, Lock, LockOpen, Power } from 'lucide-react';
import { nutritionPlanAPI } from '../services/nutritionPlanApi';
import type { NutritionPlan } from '../types';

type Props = {
  plan: NutritionPlan | null;
  onUpdate: (plan: NutritionPlan) => void;
};

const statusLabel: Record<NutritionPlan['status'], string> = {
  borrador: 'Borrador',
  activo: 'Activo',
  inactivo: 'Inactivo',
};

export function NutritionPlanPanel({ plan, onUpdate }: Props) {
  const [startDate, setStartDate] = useState(plan?.startDate ?? '');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!plan) {
    return (
      <div className="bg-surface rounded-3xl border border-border p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
        <h3 className="text-lg font-bold text-foreground mb-2">Plan nutricional</h3>
        <p className="text-sm text-muted">Este paciente aún no tiene un plan nutricional asignado.</p>
      </div>
    );
  }

  const run = async (action: () => Promise<NutritionPlan>) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const updated = await action();
      onUpdate(updated);
      setMessage('Cambios guardados correctamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-3xl border border-border p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-foreground">Plan nutricional</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          plan.status === 'activo'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
            : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
        }`}>
          {statusLabel[plan.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-surface-hover border border-border">
          <p className="text-[11px] font-bold text-muted uppercase mb-1">Módulo Mi Plan (móvil)</p>
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            {plan.moduleLocked ? <Lock size={16} className="text-orange-500" /> : <LockOpen size={16} className="text-emerald-500" />}
            {plan.moduleLocked ? 'Bloqueado' : 'Habilitado'}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-surface-hover border border-border">
          <p className="text-[11px] font-bold text-muted uppercase mb-1">Fecha de activación</p>
          <p className="text-sm font-semibold text-foreground">{plan.activatedAt ?? 'Sin activar'}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {plan.status !== 'activo' && (
          <button
            type="button"
            disabled={loading}
            onClick={() => run(() => nutritionPlanAPI.activate(plan.id))}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-gray-900 font-semibold py-2 px-4 rounded-full text-sm disabled:opacity-60"
          >
            <Power size={16} /> Activar plan
          </button>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={() => run(() => nutritionPlanAPI.setModuleLock(plan.id, !plan.moduleLocked))}
          className="flex items-center gap-2 border border-border hover:bg-surface-hover text-foreground font-semibold py-2 px-4 rounded-full text-sm disabled:opacity-60"
        >
          {plan.moduleLocked ? <LockOpen size={16} /> : <Lock size={16} />}
          {plan.moduleLocked ? 'Desbloquear Mi Plan' : 'Bloquear Mi Plan'}
        </button>
      </div>

      <div className="pt-4 border-t border-border">
        <label className="flex items-center gap-2 text-[12px] font-semibold text-muted mb-2">
          <Calendar size={14} /> Fecha de inicio del plan
        </label>
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
          />
          <button
            type="button"
            disabled={loading || !startDate}
            onClick={() => run(() => nutritionPlanAPI.setStartDate(plan.id, startDate))}
            className="bg-surface-hover hover:bg-border/40 border border-border text-foreground font-semibold py-2 px-4 rounded-full text-sm disabled:opacity-60"
          >
            Guardar fecha
          </button>
        </div>
        <p className="text-[11px] text-muted mt-2">La fecha debe ser hoy o hasta 3 meses en el futuro.</p>
      </div>

      {message && <p className="text-sm text-emerald-600 font-medium">{message}</p>}
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
}
