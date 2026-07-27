import { useState } from 'react';
import { Activity, ArrowRight, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { ClinicalEvaluation } from '../types';

interface Props {
  evaluations: ClinicalEvaluation[];
}

export function EvaluationComparison({ evaluations }: Props) {
  if (evaluations.length < 2) return null;

  // Ordenar por fecha descendente
  const sorted = [...evaluations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const [baseId, setBaseId] = useState(sorted[1].id);
  const [compareId, setCompareId] = useState(sorted[0].id);

  const base = sorted.find(e => e.id === baseId) || sorted[1];
  const compare = sorted.find(e => e.id === compareId) || sorted[0];

  const getDifference = (val1: number, val2: number) => {
    const diff = val2 - val1;
    return diff;
  };

  const renderDiff = (diff: number, unit: string, inverseGood: boolean = false) => {
    if (diff === 0) return <span className="flex items-center text-gray-500"><Minus size={14} className="mr-1" /> Sin cambio</span>;
    
    const isGood = inverseGood ? diff < 0 : diff > 0;
    const color = isGood ? 'text-emerald-500' : 'text-red-500';
    const Icon = diff > 0 ? ArrowUpRight : ArrowDownRight;

    return (
      <span className={`flex items-center font-bold ${color}`}>
        <Icon size={14} className="mr-1" />
        {diff > 0 ? '+' : ''}{diff.toFixed(1)}{unit}
      </span>
    );
  };

  return (
    <div className="bg-surface rounded-3xl border border-border p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-colors mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Activity size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Comparación de Evaluaciones</h2>
          <p className="text-sm text-muted">Compara dos evaluaciones clínicas para ver el progreso.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-muted uppercase mb-2">Evaluación Base</label>
          <select 
            value={baseId} 
            onChange={(e) => setBaseId(e.target.value)}
            className="w-full px-4 py-2.5 bg-surface-hover border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {sorted.map(e => (
              <option key={`base-${e.id}`} value={e.id}>{new Date(e.date).toLocaleDateString()} - {e.weight}kg</option>
            ))}
          </select>
        </div>
        <div className="hidden md:flex mt-6 text-muted">
          <ArrowRight size={24} />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-muted uppercase mb-2">Evaluación a Comparar</label>
          <select 
            value={compareId} 
            onChange={(e) => setCompareId(e.target.value)}
            className="w-full px-4 py-2.5 bg-surface-hover border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {sorted.map(e => (
              <option key={`compare-${e.id}`} value={e.id} disabled={e.id === baseId}>
                {new Date(e.date).toLocaleDateString()} - {e.weight}kg
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-xs font-bold text-muted uppercase">Indicador</th>
              <th className="pb-3 text-xs font-bold text-muted uppercase">Base</th>
              <th className="pb-3 text-xs font-bold text-muted uppercase">Actual</th>
              <th className="pb-3 text-xs font-bold text-muted uppercase">Diferencia</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-border hover:bg-surface-hover transition-colors">
              <td className="py-4 font-semibold text-foreground">Peso Corporal</td>
              <td className="py-4 text-muted">{base.weight} kg</td>
              <td className="py-4 font-bold text-foreground">{compare.weight} kg</td>
              <td className="py-4">{renderDiff(getDifference(base.weight, compare.weight), 'kg', true)}</td>
            </tr>
            <tr className="border-b border-border hover:bg-surface-hover transition-colors">
              <td className="py-4 font-semibold text-foreground">Grasa Corporal</td>
              <td className="py-4 text-muted">{base.bodyFat}%</td>
              <td className="py-4 font-bold text-foreground">{compare.bodyFat}%</td>
              <td className="py-4">{renderDiff(getDifference(base.bodyFat, compare.bodyFat), '%', true)}</td>
            </tr>
            <tr className="hover:bg-surface-hover transition-colors">
              <td className="py-4 font-semibold text-foreground">Masa Muscular</td>
              <td className="py-4 text-muted">{base.muscleMass} kg</td>
              <td className="py-4 font-bold text-foreground">{compare.muscleMass} kg</td>
              <td className="py-4">{renderDiff(getDifference(base.muscleMass, compare.muscleMass), 'kg', false)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
